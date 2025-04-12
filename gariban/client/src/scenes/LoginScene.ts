import { Scene } from 'phaser';
import type { Socket } from 'socket.io-client';

export class LoginScene extends Scene {
    private usernameInput?: HTMLInputElement;
    private socket!: Socket;

    constructor() {
        super({ key: 'LoginScene' });
    }

    init(data: { socket: Socket }) {
        this.socket = data.socket;
    }

    create() {
        // Başlık
        this.add.text(400, 150, 'Gariban', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Kullanıcı adı giriş alanı
        const element = document.createElement('div');
        element.innerHTML = `
            <input type="text" id="username" placeholder="Kullanıcı adınızı girin" 
                style="width: 200px; padding: 8px; font-size: 16px;">
            <button id="startButton" style="padding: 8px 16px; margin-left: 8px;">Başla</button>
        `;

        // DOM elementlerini ekle
        this.add.dom(400, 250, element);

        // Input ve buton referanslarını al
        this.usernameInput = document.getElementById('username') as HTMLInputElement;
        const startButton = document.getElementById('startButton');

        // Başla butonuna tıklama olayı
        startButton?.addEventListener('click', () => {
            const username = this.usernameInput?.value.trim();
            if (username && username.length >= 3) {
                // Eşleşme sahnesine geç
                this.scene.start('MatchmakingScene', {
                    socket: this.socket,
                    username: username
                });
            } else {
                alert('Lütfen en az 3 karakterli bir kullanıcı adı girin!');
            }
        });
    }

    destroy() {
        // DOM elementlerini temizle
        this.usernameInput?.remove();
    }
} 