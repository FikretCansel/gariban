import { Game, AUTO, Scale } from 'phaser'
import io from 'socket.io-client'
import { LoginScene } from './scenes/LoginScene'
import { MatchmakingScene } from './scenes/MatchmakingScene'
import { GameScene } from './scenes/GameScene'

// Socket.io bağlantısı
const socket = io('/')

// Oyun konfigürasyonu
const config = {
    type: AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: '#2d2d2d',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    dom: {
        createContainer: true
    },
    scene: [LoginScene, MatchmakingScene, GameScene]
}

// Oyunu başlat
const game = new Game(config)

// İlk sahneyi başlat
game.scene.start('LoginScene', { socket })
