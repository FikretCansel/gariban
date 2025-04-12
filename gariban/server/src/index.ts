import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Oyun odaları
interface GameUnit {
    type: string;
    x: number;
    y: number;
    health: number;
}

interface GameRoom {
    players: string[];
    gameState: {
        units: GameUnit[];
    };
}

const gameRooms = new Map<string, GameRoom>();

// Eşleşme kuyruğu
let matchmakingQueue: { socket: any; username: string }[] = [];

// Socket.io bağlantı yönetimi
io.on('connection', (socket) => {
    console.log('Yeni bir oyuncu bağlandı:', socket.id);

    // Eşleşme isteği
    socket.on('findMatch', ({ username }) => {
        console.log(`${username} eşleşme arıyor`);

        // Oyuncuyu kuyruğa ekle
        matchmakingQueue.push({ socket, username });

        // Eğer kuyrukta 2 oyuncu varsa eşleştir
        if (matchmakingQueue.length >= 2) {
            const player1 = matchmakingQueue.shift()!;
            const player2 = matchmakingQueue.shift()!;

            // Oyun odası oluştur
            const roomId = `game_${Date.now()}`;
            const gameRoom: GameRoom = {
                players: [player1.username, player2.username],
                gameState: {
                    units: [
                        { type: '', x: 0, y: 0, health: 0 },
                        { type: '', x: 0, y: 0, health: 0 }
                    ]
                }
            };

            gameRooms.set(roomId, gameRoom);

            // Oyuncuları odaya ekle
            player1.socket.join(roomId);
            player2.socket.join(roomId);

            console.log(`Oda ${roomId} oluşturuldu ve oyuncular eklendi`);

            // Her iki oyuncuya da eşleşme bilgisini gönder
            player1.socket.emit('matchFound', { opponent: player2.username, roomId });
            player2.socket.emit('matchFound', { opponent: player1.username, roomId });

            console.log(`Eşleşme bulundu: ${player1.username} vs ${player2.username}`);
        }
    });

    // Birim hareketi
    socket.on('unitsMoved', (data: {
        roomId: string;
        from: { x: number; y: number };
        to: { x: number; y: number };
        units: string[];
        owner: string;
    }) => {
        console.log('Birim hareketi alındı:', data);
        
        const room = gameRooms.get(data.roomId);
        if (room) {
            console.log(`Oda ${data.roomId} bulundu, hareket işleniyor`);
            
            // Oyun durumunu güncelle
            const units = room.gameState.units;
            if (units) {
                // Birimlerin konumunu güncelle
                units.forEach(unit => {
                    if (unit.x === data.from.x && unit.y === data.from.y) {
                        unit.x = data.to.x;
                        unit.y = data.to.y;
                    }
                });
            }

            // Diğer oyuncuya hareket bilgisini ilet
            socket.to(data.roomId).emit('unitsUpdated', data);
            console.log('Hareket bilgisi diğer oyuncuya iletildi');
        } else {
            console.log(`Oda ${data.roomId} bulunamadı!`);
        }
    });

    // Birim saldırısı
    socket.on('unitAttacked', (data: { roomId: string; attacker: any; target: any; damage: number }) => {
        console.log('Saldırı alındı:', data);
        const room = gameRooms.get(data.roomId);
        if (room) {
            // Saldırıyı odadaki tüm oyunculara ilet
            io.to(data.roomId).emit('unitAttacked', data);
            
            // Hedef birimin sağlığını güncelle
            const targetUnit = room.gameState.units.find(
                (unit: GameUnit) => unit.x === data.target.x && unit.y === data.target.y
            );
            
            if (targetUnit) {
                targetUnit.health = Math.max(0, targetUnit.health - data.damage);
                console.log(`Birim sağlığı güncellendi: ${targetUnit.health}`);
                
                // Eğer birim öldüyse, listeden kaldır
                if (targetUnit.health <= 0) {
                    console.log('Birim öldü:', targetUnit);
                    room.gameState.units = room.gameState.units.filter(
                        (unit: GameUnit) => !(unit.x === targetUnit.x && unit.y === targetUnit.y)
                    );
                }
            }
        }
    });

    // Oyun sonu kontrolü
    socket.on('checkGameOver', (data: { roomId: string; deadPlayer: string }) => {
        console.log('Oyun sonu kontrolü:', data);
        
        const room = gameRooms.get(data.roomId);
        if (room) {
            // Ölen oyuncunun rakibini bul
            const winner = data.deadPlayer === room.players[0] ? room.players[1] : room.players[0];
            
            // Tüm oyunculara oyun sonu bilgisini gönder
            io.to(data.roomId).emit('gameOver', { winner });
            
            console.log(`Oyun bitti! Kazanan: ${winner}`);
            
            // Odayı temizle
            gameRooms.delete(data.roomId);
        }
    });

    // Bağlantı koptuğunda
    socket.on('disconnect', () => {
        console.log('Bir oyuncu ayrıldı:', socket.id);
        // Kuyruktaki oyuncuyu temizle
        matchmakingQueue = matchmakingQueue.filter(player => player.socket !== socket);
    });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
}); 