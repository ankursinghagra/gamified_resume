import { WORLD_WIDTH, WORLD_HEIGHT } from './app_config.js';
import { manifest } from './assets.js';
import { add_Water_bg, add_ground, add_frame, create_debug_overlay } from './world.js';
import { add_player } from './player.js';
import { setupUI } from './ui.js';
import { initAudio } from './audio.js';

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
