import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";
import { Game } from "./game.js";

// DOM Elements
const canvas = document.getElementById("c");
const ui = {
    menu: document.getElementById("menu"),
    settings: document.getElementById("settings"),
    hud: document.getElementById("hud"),
    pause: document.getElementById("pause"),
    gameover: document.getElementById("gameover"),
    
    // Buttons
    btnPlay: document.getElementById("btnPlay"),
    btnSettings: document.getElementById("btnSettings"),
    btnBack: document.getElementById("btnBack"),
    btnPause: document.getElementById("btnPause"),
    btnResume: document.getElementById("btnResume"),
    btnRestart: document.getElementById("btnRestart"),
    btnQuit: document.getElementById("btnQuit"),
    btnAgain: document.getElementById("btnAgain"),
    btnMenu: document.getElementById("btnMenu"),

    // Values
    highScore: document.getElementById("highScoreValue"),
    score: document.getElementById("hudScore"),
    coins: document.getElementById("hudCoins"),
    
    // Settings
    volume: document.getElementById("volume"),
    quality: document.getElementById("quality"),
    music: document.getElementById("musicToggle")
};

// State Management
const getHigh = () => Number(localStorage.getItem('metroHigh') || 0);
const setHigh = (v) => {
    localStorage.setItem('metroHigh', v);
    ui.highScore.innerText = v;
};
setHigh(getHigh());

// Initialize Game
const game = new Game({
    THREE, 
    canvas,
    getHighScore: getHigh,
    setHighScore: setHigh,
    onHud: (data) => {
        ui.score.innerText = data.score;
        ui.coins.innerText = data.coins;
    },
    onGameOver: (data) => {
        switchPanel(ui.gameover);
        document.getElementById('finalScore').innerText = data.score;
        document.getElementById('finalCoins').innerText = data.coins;
        document.getElementById('gameOverReason').innerText = data.reason;
        
        const badge = document.getElementById('newHigh');
        if(data.isNewHigh) badge.classList.remove('hidden');
        else badge.classList.add('hidden');
    }
});

// UI Helper
function switchPanel(target) {
    [ui.menu, ui.settings, ui.hud, ui.pause, ui.gameover].forEach(p => p.classList.add('hidden'));
    if(target) target.classList.remove('hidden');
}

// Event Listeners
ui.btnPlay.onclick = () => {
    switchPanel(ui.hud);
    game.startRun();
};

ui.btnSettings.onclick = () => switchPanel(ui.settings);
ui.btnBack.onclick = () => switchPanel(ui.menu);

ui.btnPause.onclick = () => {
    game.pause();
    ui.pause.classList.remove('hidden');
};

ui.btnResume.onclick = () => {
    game.resume();
    ui.pause.classList.add('hidden');
};

ui.btnRestart.onclick = ui.btnAgain.onclick = () => {
    switchPanel(ui.hud);
    game.restart();
};

ui.btnQuit.onclick = ui.btnMenu.onclick = () => {
    game.quitToMenu();
    switchPanel(ui.menu);
};

// Settings Listeners
const updateSettings = () => {
    game.setAudioSettings({
        volume: parseFloat(ui.volume.value),
        musicEnabled: ui.music.checked
    });
    game.setQuality(ui.quality.value);
};

ui.volume.oninput = updateSettings;
ui.music.onchange = updateSettings;
ui.quality.onchange = updateSettings;

// Initial Setup
updateSettings();
switchPanel(ui.menu);
window.onresize = () => game.resize();
game.resize();