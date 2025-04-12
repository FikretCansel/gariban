import { Scene } from 'phaser';
import type { Socket } from 'socket.io-client';

export class MatchmakingScene extends Scene {
    private username: string = '';
    private socket!: Socket;
    private matchmakingText?: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'MatchmakingScene' });
    }

    init(data: { socket: Socket, username: string }) {
        this.socket = data.socket;
        this.username = data.username;
    }

    create() {
        // Eşleşme ekranı başlığı
        this.add.text(400, 200, 'Eşleşme Bekleniyor...', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Kullanıcı adını göster
        this.add.text(400, 250, `Kullanıcı Adı: ${this.username}`, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Eşleşme durumu metni
        this.matchmakingText = this.add.text(400, 300, 'Rakip oyuncu bekleniyor...', {
            fontSize: '20px',
            color: '#ffff00'
        }).setOrigin(0.5);

        // Eşleşme olaylarını dinle
        this.socket.on('matchFound', (data: { opponent: string, roomId: string }) => {
            this.matchmakingText?.setText(`Eşleşme bulundu! Rakip: ${data.opponent}`);
            // 2 saniye sonra oyun sahnesine geç
            this.time.delayedCall(2000, () => {
                this.scene.start('GameScene', {
                    socket: this.socket,
                    username: this.username,
                    opponent: data.opponent,
                    roomId: data.roomId
                });
            });
        });

        // Eşleşme için sunucuya bildir
        this.socket.emit('findMatch', { username: this.username });
    }
} 