import { Scene } from 'phaser';
import { Socket } from 'socket.io-client';

interface Tile {
    sprite: Phaser.GameObjects.Rectangle;
    x: number;
    y: number;
    isSelected: boolean;
}

interface UnitStats {
    health: number;
    maxHealth: number;
    damage: number;
    range: number;
    speed: number;
}

interface Unit {
    sprite: Phaser.GameObjects.Sprite;
    circle: Phaser.GameObjects.Arc;
    type: 'archer' | 'infantry' | 'cavalry';
    owner: string;
    stats: UnitStats;
    healthBar?: Phaser.GameObjects.Rectangle;
    healthBarBg?: Phaser.GameObjects.Rectangle;
}

export class GameScene extends Scene {
    private socket!: typeof Socket;
    private username: string = '';
    private opponent: string = '';
    private roomId: string = '';
    private tiles: Tile[][] = [];
    private selectedUnits: Unit[] = [];
    private units: Map<string, Unit[]> = new Map(); // owner -> units
    private TILE_SIZE = 40;
    private MAP_SIZE = 15; // 15x15 kare
    private unitStats = {
        archer: {
            health: 60,
            maxHealth: 60,
            damage: 15,
            range: 4,
            speed: 2
        },
        infantry: {
            health: 100,
            maxHealth: 100,
            damage: 20,
            range: 1,
            speed: 1
        },
        cavalry: {
            health: 80,
            maxHealth: 80,
            damage: 25,
            range: 1,
            speed: 3
        }
    };

    constructor() {
        super({ key: 'GameScene' });
    }

    init(data: { socket: typeof Socket; username: string; opponent: string; roomId: string }) {
        this.socket = data.socket;
        this.username = data.username;
        this.opponent = data.opponent;
        this.roomId = data.roomId;

        console.log('GameScene başlatıldı:', {
            username: this.username,
            opponent: this.opponent,
            roomId: this.roomId
        });

        // Birim listelerini başlat
        this.units.set(this.username, []);
        this.units.set(this.opponent, []);

        // Diğer oyuncunun birim hareketlerini dinle
        this.socket.on('unitsUpdated', (data: {
            roomId: string;
            from: { x: number; y: number };
            to: { x: number; y: number };
            units: string[];
            owner: string;
        }) => {
            console.log('unitsUpdated olayı alındı:', data);
            
            if (data.roomId === this.roomId && data.owner !== this.username) {
                console.log('Rakip birimi hareket etti:', data);
                // Rakip birimlerini hareket ettir
                const opponentUnits = this.units.get(this.opponent);
                console.log('Rakip birimleri:', opponentUnits);
                
                if (opponentUnits) {
                    // Rakip birimlerinin konumlarını kontrol et
                    opponentUnits.forEach(unit => {
                        const unitX = Math.floor(unit.sprite.x / this.TILE_SIZE);
                        const unitY = Math.floor(unit.sprite.y / this.TILE_SIZE);
                        console.log('Birim pozisyonu:', { unitX, unitY, fromX: data.from.x, fromY: data.from.y });
                    });

                    // Hareket edilecek birimi bul
                    const unitToMove = opponentUnits.find(unit => {
                        const unitX = Math.floor(unit.sprite.x / this.TILE_SIZE);
                        const unitY = Math.floor(unit.sprite.y / this.TILE_SIZE);
                        return unit.type === data.units[0];
                    });

                    if (unitToMove) {
                        console.log('Hareket ettirilecek birim bulundu:', unitToMove);
                        this.moveUnitWithAnimation(unitToMove, data.to.x, data.to.y);
                    }
                }
            }
        });

        // Savaş olaylarını dinle
        this.socket.on('unitAttacked', (data: {
            roomId: string;
            attacker: { x: number; y: number; type: string };
            target: { x: number; y: number };
            damage: number;
        }) => {
            if (data.roomId === this.roomId) {
                console.log('Savaş olayı alındı:', data);
                this.handleAttack(data);
            }
        });

        // Oyun sonu olayını dinle
        this.socket.on('gameOver', (data: { winner: string }) => {
            console.log('Oyun sonu durumu alındı:', data);
            
            const myUnits = this.units.get(this.username) || [];
            const opponentUnits = this.units.get(this.opponent) || [];

            // Oyun sonu mesajı
            const isWinner = data.winner === this.username;
            const gameOverText = this.add.text(400, 250, 'OYUN BİTTİ', {
                fontSize: '48px',
                color: '#ff0000',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            const resultText = this.add.text(400, 320, isWinner ? 'Tebrikler! Kazandınız!' : 'Maalesef kaybettiniz!', {
                fontSize: '32px',
                color: isWinner ? '#00ff00' : '#ff0000',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            const statsText = this.add.text(400, 380, 
                `Kalan Birimler:\nSen: ${myUnits.length}\nRakip: ${opponentUnits.length}`, {
                fontSize: '24px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            // Efekt animasyonu
            this.tweens.add({
                targets: [gameOverText, resultText],
                scaleX: [0, 1],
                scaleY: [0, 1],
                duration: 1000,
                ease: 'Bounce'
            });

            // Oyun alanını kararttır
            const overlay = this.add.rectangle(0, 0, 
                this.MAP_SIZE * this.TILE_SIZE, 
                this.MAP_SIZE * this.TILE_SIZE,
                0x000000, 0.5
            ).setOrigin(0, 0);

            // Tüm birimleri etkileşimsiz yap
            this.units.forEach(units => {
                units.forEach(unit => {
                    unit.circle.disableInteractive();
                });
            });

            // Input olaylarını devre dışı bırak
            if (this.input.keyboard) this.input.keyboard.enabled = false;
            if (this.input.mouse) this.input.mouse.enabled = false;
        });
    }

    create() {
        // Harita arka planı
        this.createMap();

        // Oyuncu bilgileri
        const isBlackTeam = this.username < this.opponent; // Alfabetik olarak önce gelen siyah takım olsun
        const teamColor = isBlackTeam ? 'Siyah' : 'Beyaz';
        this.add.text(10, 10, `Sen: ${this.username} (${teamColor})`, { color: isBlackTeam ? '#000000' : '#ffffff' });
        this.add.text(10, 30, `Rakip: ${this.opponent} (${!isBlackTeam ? 'Siyah' : 'Beyaz'})`, { color: !isBlackTeam ? '#000000' : '#ffffff' });

        // Mouse olaylarını dinle
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const tileX = Math.floor(pointer.x / this.TILE_SIZE);
            const tileY = Math.floor(pointer.y / this.TILE_SIZE);

            if (this.isValidTile(tileX, tileY)) {
                if (pointer.rightButtonDown()) {
                    // Sağ tık - hareket ettirme
                    if (this.selectedUnits.length > 0) {
                        // Hedef konumda düşman var mı kontrol et
                        const targetUnit = this.findUnitAtTile(tileX, tileY);
                        if (targetUnit && targetUnit.owner !== this.username) {
                            this.attackUnit(this.selectedUnits[0], targetUnit);
                        } else {
                            this.moveUnits(tileX, tileY);
                        }
                    }
                } else {
                    // Sol tık - seçme
                    this.selectTile(tileX, tileY);
                    this.selectUnitsInTile(tileX, tileY);
                }
            }
        });

        // Kendi birimlerini yerleştir
        if (isBlackTeam) {
            // Siyah takım - Sol üst köşe
            this.createUnit(1, 1, 'archer', this.username);
            this.createUnit(2, 1, 'infantry', this.username);
            this.createUnit(1, 2, 'cavalry', this.username);

            // Beyaz takımın birimlerini oluştur
            this.createUnit(this.MAP_SIZE - 2, this.MAP_SIZE - 2, 'archer', this.opponent);
            this.createUnit(this.MAP_SIZE - 3, this.MAP_SIZE - 2, 'infantry', this.opponent);
            this.createUnit(this.MAP_SIZE - 2, this.MAP_SIZE - 3, 'cavalry', this.opponent);
        } else {
            // Beyaz takım - Sağ alt köşe
            this.createUnit(this.MAP_SIZE - 2, this.MAP_SIZE - 2, 'archer', this.username);
            this.createUnit(this.MAP_SIZE - 3, this.MAP_SIZE - 2, 'infantry', this.username);
            this.createUnit(this.MAP_SIZE - 2, this.MAP_SIZE - 3, 'cavalry', this.username);

            // Siyah takımın birimlerini oluştur
            this.createUnit(1, 1, 'archer', this.opponent);
            this.createUnit(2, 1, 'infantry', this.opponent);
            this.createUnit(1, 2, 'cavalry', this.opponent);
        }
    }

    private createMap() {
        // Kareli harita oluştur
        for (let y = 0; y < this.MAP_SIZE; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.MAP_SIZE; x++) {
                const tile = this.add.rectangle(
                    x * this.TILE_SIZE + this.TILE_SIZE / 2,
                    y * this.TILE_SIZE + this.TILE_SIZE / 2,
                    this.TILE_SIZE - 1,
                    this.TILE_SIZE - 1,
                    0x444444
                );
                tile.setStrokeStyle(1, 0x666666);

                this.tiles[y][x] = {
                    sprite: tile,
                    x: x,
                    y: y,
                    isSelected: false
                };
            }
        }
    }

    private selectTile(x: number, y: number) {
        // Önceki seçimleri temizle
        this.clearSelection();

        const tile = this.tiles[y][x];
        tile.isSelected = true;
        tile.sprite.setStrokeStyle(2, 0x00ff00);
    }

    private clearSelection() {
        this.selectedUnits = [];
        for (let y = 0; y < this.MAP_SIZE; y++) {
            for (let x = 0; x < this.MAP_SIZE; x++) {
                const tile = this.tiles[y][x];
                tile.isSelected = false;
                tile.sprite.setStrokeStyle(1, 0x666666);
            }
        }
    }

    private selectUnitsInTile(x: number, y: number) {
        const myUnits = this.units.get(this.username) || [];
        this.selectedUnits = myUnits.filter(unit => 
            Math.floor(unit.sprite.x / this.TILE_SIZE) === x &&
            Math.floor(unit.sprite.y / this.TILE_SIZE) === y
        );
    }

    private isValidTile(x: number, y: number): boolean {
        return x >= 0 && x < this.MAP_SIZE && y >= 0 && y < this.MAP_SIZE;
    }

    private findUnitAtTile(x: number, y: number): Unit | undefined {
        const allUnits = [...(this.units.get(this.username) || []), ...(this.units.get(this.opponent) || [])];
        return allUnits.find(unit => 
            Math.floor(unit.sprite.x / this.TILE_SIZE) === x &&
            Math.floor(unit.sprite.y / this.TILE_SIZE) === y
        );
    }

    private attackUnit(attacker: Unit, target: Unit) {
        const distance = Phaser.Math.Distance.Between(
            attacker.sprite.x,
            attacker.sprite.y,
            target.sprite.x,
            target.sprite.y
        ) / this.TILE_SIZE;

        if (distance <= attacker.stats.range) {
            // Saldırı animasyonu
            this.tweens.add({
                targets: attacker.circle,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    // Sunucuya bildir
                    this.socket.emit('unitAttacked', {
                        roomId: this.roomId,
                        attacker: {
                            x: Math.floor(attacker.sprite.x / this.TILE_SIZE),
                            y: Math.floor(attacker.sprite.y / this.TILE_SIZE),
                            type: attacker.type
                        },
                        target: {
                            x: Math.floor(target.sprite.x / this.TILE_SIZE),
                            y: Math.floor(target.sprite.y / this.TILE_SIZE)
                        },
                        damage: attacker.stats.damage
                    });
                }
            });
        } else {
            // Menzil dışındaysa, hedefe doğru hareket et
            const path = this.findPathToTarget(attacker, target);
            if (path.length > 0) {
                const nextTile = path[0];
                this.moveUnits(nextTile.x, nextTile.y);
            }
        }
    }

    private findPathToTarget(attacker: Unit, target: Unit): { x: number; y: number }[] {
        // Basit bir yol bulma - hedef yönünde bir adım
        const currentX = Math.floor(attacker.sprite.x / this.TILE_SIZE);
        const currentY = Math.floor(attacker.sprite.y / this.TILE_SIZE);
        const targetX = Math.floor(target.sprite.x / this.TILE_SIZE);
        const targetY = Math.floor(target.sprite.y / this.TILE_SIZE);

        const dx = Math.sign(targetX - currentX);
        const dy = Math.sign(targetY - currentY);

        return [{ x: currentX + dx, y: currentY + dy }];
    }

    private handleAttack(data: {
        attacker: { x: number; y: number; type: string };
        target: { x: number; y: number };
        damage: number;
    }) {
        console.log('Saldırı işleniyor:', data);
        
        // Hedef birimi bul
        const targetUnit = this.findUnitAtTile(data.target.x, data.target.y);
        if (targetUnit) {
            // Saldırı animasyonu
            const attackerUnit = this.findUnitAtTile(data.attacker.x, data.attacker.y);
            if (attackerUnit) {
                this.tweens.add({
                    targets: attackerUnit.circle,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 100,
                    yoyo: true
                });
            }

            // Hasar animasyonu
            this.tweens.add({
                targets: targetUnit.circle,
                alpha: 0.5,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    // Hasarı uygula
                    targetUnit.stats.health = Math.max(0, targetUnit.stats.health - data.damage);
                    console.log(`Birim hasarı güncellendi: ${targetUnit.stats.health}`);
                    
                    // Can barını güncelle
                    this.updateHealthBar(targetUnit);

                    // Eğer birim öldüyse
                    if (targetUnit.stats.health <= 0) {
                        console.log('Birim öldü:', targetUnit);
                        this.destroyUnit(targetUnit);
                    }
                }
            });
        }
    }

    private destroyUnit(unit: Unit) {
        // Animasyon ve efektler
        this.tweens.add({
            targets: [unit.sprite, unit.circle, unit.healthBar, unit.healthBarBg],
            alpha: 0,
            duration: 500,
            onComplete: () => {
                unit.sprite.destroy();
                unit.circle.destroy();
                unit.healthBar?.destroy();
                unit.healthBarBg?.destroy();

                // Listeden kaldır
                const ownerUnits = this.units.get(unit.owner) || [];
                const index = ownerUnits.indexOf(unit);
                if (index > -1) {
                    ownerUnits.splice(index, 1);
                    this.units.set(unit.owner, ownerUnits); // Güncellenmiş listeyi kaydet

                    // Sadece birim öldükten ve listeden kaldırıldıktan sonra oyun sonu kontrolü yap
                    if (ownerUnits.length === 0) {
                        // Sunucuya bildir
                        this.socket.emit('checkGameOver', {
                            roomId: this.roomId,
                            deadPlayer: unit.owner
                        });
                    }
                }
            }
        });
    }

    private updateHealthBar(unit: Unit) {
        if (unit.healthBar) {
            const healthPercent = unit.stats.health / unit.stats.maxHealth;
            unit.healthBar.setScale(healthPercent, 1);
            unit.healthBar.setFillStyle(
                healthPercent > 0.6 ? 0x00ff00 :
                healthPercent > 0.3 ? 0xffff00 :
                0xff0000
            );
        }
    }

    private moveUnitWithAnimation(unit: Unit, targetX: number, targetY: number) {
        this.tweens.add({
            targets: [unit.sprite, unit.circle, unit.healthBar, unit.healthBarBg],
            x: targetX * this.TILE_SIZE + this.TILE_SIZE / 2,
            y: targetY * this.TILE_SIZE + this.TILE_SIZE / 2,
            duration: 1000 / unit.stats.speed,
            ease: 'Power2'
        });
    }

    private moveUnits(targetX: number, targetY: number) {
        if (this.selectedUnits.length > 0) {
            const fromX = Math.floor(this.selectedUnits[0].sprite.x / this.TILE_SIZE);
            const fromY = Math.floor(this.selectedUnits[0].sprite.y / this.TILE_SIZE);

            const moveData = {
                roomId: this.roomId,
                from: { x: fromX, y: fromY },
                to: { x: targetX, y: targetY },
                units: this.selectedUnits.map(unit => unit.type),
                owner: this.username
            };

            console.log('Birim hareketi gönderiliyor:', moveData);

            // Hareket bilgisini sunucuya gönder
            this.socket.emit('unitsMoved', moveData);

            // Birimleri hareket ettir
            this.selectedUnits.forEach(unit => {
                this.moveUnitWithAnimation(unit, targetX, targetY);
            });
        }
    }

    private createUnit(x: number, y: number, type: 'archer' | 'infantry' | 'cavalry', owner: string) {
        // Siyah takım her zaman alfabetik olarak önce gelen kullanıcı olacak
        const ownerIsBlackTeam = this.username < this.opponent ? owner === this.username : owner === this.opponent;
        
        const colors = {
            archer: ownerIsBlackTeam ? 0x000000 : 0xffffff,    // Siyah/Beyaz
            infantry: ownerIsBlackTeam ? 0x202020 : 0xe0e0e0,  // Koyu Gri/Açık Gri
            cavalry: ownerIsBlackTeam ? 0x404040 : 0xc0c0c0    // Orta Gri/Gümüş
        };

        const unit = this.add.sprite(
            x * this.TILE_SIZE + this.TILE_SIZE / 2,
            y * this.TILE_SIZE + this.TILE_SIZE / 2,
            'unit'
        );
        
        const circle = this.add.circle(
            x * this.TILE_SIZE + this.TILE_SIZE / 2,
            y * this.TILE_SIZE + this.TILE_SIZE / 2,
            this.TILE_SIZE / 3,
            colors[type]
        );

        // Can barı arka planı
        const healthBarBg = this.add.rectangle(
            x * this.TILE_SIZE + this.TILE_SIZE / 2,
            y * this.TILE_SIZE + this.TILE_SIZE / 2 - this.TILE_SIZE / 2,
            this.TILE_SIZE - 4,
            4,
            0x000000
        );

        // Can barı
        const healthBar = this.add.rectangle(
            x * this.TILE_SIZE + this.TILE_SIZE / 2,
            y * this.TILE_SIZE + this.TILE_SIZE / 2 - this.TILE_SIZE / 2,
            this.TILE_SIZE - 4,
            4,
            ownerIsBlackTeam ? 0x404040 : 0xe0e0e0
        );

        const newUnit: Unit = {
            sprite: unit,
            circle: circle,
            type: type,
            owner: owner,
            stats: { ...this.unitStats[type] },
            healthBar: healthBar,
            healthBarBg: healthBarBg
        };

        const ownerUnits = this.units.get(owner) || [];
        ownerUnits.push(newUnit);
        this.units.set(owner, ownerUnits);

        // Sadece kendi birimlerimizi seçilebilir yap
        if (owner === this.username) {
            circle.setInteractive();
        }
    }
} 