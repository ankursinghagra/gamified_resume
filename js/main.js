import { WORLD_WIDTH, WORLD_HEIGHT } from './app_config.js';
import { manifest } from './assets.js';
import { add_Water_bg, add_ground, add_frame, create_debug_overlay } from './world.js';
import { add_player } from './player.js';
import { setupUI } from './ui.js';
import { initAudio } from './audio.js';

// Wait for the Start button before loading anything
await new Promise(resolve => {
    document.getElementById('intro-start-btn').addEventListener('click', () => {
        const intro = document.getElementById('intro-screen');
        intro.style.transition = 'opacity 0.4s';
        intro.style.opacity = '0';
        setTimeout(() => intro.remove(), 420);
        resolve();
    }, { once: true });
});

// Initialize PIXI App
const app = new PIXI.Application({
    height: window.innerHeight,
    width: window.innerWidth,
    resizeTo: window,
    backgroundColor: 0x000000,
});
globalThis.__PIXI_APP__ = app;
document.body.appendChild(app.view);

// Initialize Viewport
const viewport = new PIXI.Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
    events: app.renderer.events,
    stopPropagation: true,
});

// Loading Screen
var loading_container = new PIXI.Container();
loading_container.label = "Loading";
app.stage.addChild(loading_container);

// Load Font and Assets
await PIXI.Assets.load(
    { alias: "04B_30__", src: "assets/fonts/04B_30__.woff" }
).then(() => {
    var loading_text = new PIXI.Text("Loading", {
        fontSize: 24,
        fontFamily: "04B_30__",
        fill: 0xff1010,
        align: "center",
    });
    loading_text.position.set(
        window.innerWidth / 2,
        window.innerHeight / 2
    );
    loading_container.addChild(loading_text);
});

PIXI.Assets.addBundle("resources", manifest);

const resources = await PIXI.Assets.loadBundle("resources", (progress) => {
    console.log("Loading assets...", progress);
});

// Clear loading
app.stage.removeChild(loading_container);

// Setup Scene
var home_container = new PIXI.Container();
home_container.label = "Home Container";

home_container.addChild(await add_Water_bg(resources));
home_container.addChild(await add_ground(resources));
home_container.addChild(await add_player(resources, viewport));

// Walkable zone highlight overlay (auto-hides after 5s, toggle with H)
const debugOverlay = create_debug_overlay();
home_container.addChild(debugOverlay);
home_container.cacheAsTexture = false;
home_container.cacheAsBitmap  = false;

let overlayAutoHide = true;
let overlayFrames = 5 * 60; // 5 seconds at 60fps
app.ticker.add((delta) => {
    if (!overlayAutoHide) return;
    overlayFrames -= delta;
    if (overlayFrames <= 60) {
        debugOverlay.alpha = Math.max(0, overlayFrames / 60);
    }
    if (overlayFrames <= 0) {
        debugOverlay.visible = false;
        overlayAutoHide = false;
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') {
        overlayAutoHide = false;
        debugOverlay.alpha = 1;
        debugOverlay.visible = !debugOverlay.visible;
    }
});

// Clouds — top layer inside world, fly left to right at random heights
const cloudDefs = [
    { x: 300,  y: 270, speed: 0.5, scale: 2.2 },
    { x: 1100, y: 340, speed: 0.8, scale: 1.6 },
    { x: 1800, y: 200, speed: 0.35, scale: 2.8 },
    { x: 1300,  y: 470, speed: 0.65, scale: 2.2 },
    { x: 600, y: 640, speed: 0.7, scale: 1.6 },
    { x: 100, y: 400, speed: 0.45, scale: 2.8 },
];
const cloudSprites = cloudDefs.map(d => {
    const spr = new PIXI.Sprite(resources['cloud']);
    spr.anchor.set(0.5);
    spr.scale.set(d.scale);
    spr.alpha = 0.72;
    spr.x = d.x;
    spr.y = d.y;
    spr._speed = d.speed;
    home_container.addChild(spr);
    return spr;
});
app.ticker.add((delta) => {
    for (const c of cloudSprites) {
        c.x += c._speed * delta;
        if (c.x - c.width / 2 > WORLD_WIDTH + 100) {
            c.x = -c.width / 2 - 20;
            c.y = 180 + Math.random() * 220;
        }
    }
});

// Add to Viewport
viewport.addChild(home_container);
app.stage.addChild(viewport);

// Viewport Config
viewport.drag();
viewport.wheel();
viewport.clamp({
    direction: "all",
    left: 0,
    right: WORLD_WIDTH,
    top: 0,
    bottom: WORLD_HEIGHT,
});
viewport.clampZoom({ minScale: 1, maxScale: 1 });
viewport.moveCorner(0, 0);

// Add UI Frame (on top of viewport?)
// Originally added joined with app.stage, separate from viewport moving content
app.stage.addChild(await add_frame(resources));

// Debug Restricted Area// Initialize UI
initAudio();
setupUI();

console.log("Game initialized!");
