import { turning_rects, COLLIDERS } from './app_config.js';
import { showNotification, hideNotification, showModal, getIsModalOpen, setOnModalClose } from './ui.js';

let currentZone = null;

export async function add_player(resources, viewport) {
    // ... (existing helper closure, no changes to init logic needed)
    var player_container = new PIXI.Container();

    // Pick direction frames by index (interleaved layout):
    // Down: 0,4,8,12 | Up: 1,5,9,13 | Left: 2,6,10,14 | Right: 3,7,11,15
    const allTextures = resources.Player_Anim_json.animations.Player_Anim;
    const dirTextures = {
        down:  [0, 4,  8, 12].map(i => allTextures[i]),
        up:    [1, 5,  9, 13].map(i => allTextures[i]),
        left:  [2, 6, 10, 14].map(i => allTextures[i]),
        right: [3, 7, 11, 15].map(i => allTextures[i]),
    };

    let anim = new PIXI.AnimatedSprite(dirTextures.down);
    anim.scale.set(2.5);
    anim.position.set(0, 0);
    anim.animationSpeed = 1 / 10;
    anim.loop = true;
    anim.stop();          // start idle — will play when moving
    anim.currentFrame = 0;
    player_container.addChild(anim);
    player_container.position.set(550, 250);

    // Attach animation state so move_player can access it
    player_container._anim = anim;
    player_container._dirTextures = dirTextures;
    player_container._animDir = 'down';
    player_container._idleTimer = null;

    // Re-show notification if player is still on a zone when modal closes
    setOnModalClose(() => {
        if (currentZone) showNotification();
    });

    // Initial check
    check_zone(player_container);

    document.addEventListener("keydown", (event) => {
        if (getIsModalOpen()) {
            if (event.key === "Escape") {
                // hideModal() is handled by UI but we could trigger a click on close button or expose a direct hide method
            }
            return; 
        }

        if (event.key == "e" || event.key == "E") {
            if (currentZone) {
                showModal(currentZone);
            }
        }

        if (event.key == "ArrowRight") {
            move_forward(player_container, viewport);
        } else if (event.key == "ArrowLeft") {
            move_backward(player_container, viewport);
        }
        if (event.key == "ArrowDown") {
            move_player(player_container, viewport, "down");
        } else if (event.key == "ArrowUp") {
            move_player(player_container, viewport, "up");
        }
        check_zone(player_container);
    });

    return player_container;
}

function move_forward(player_container, viewport) {
    move_player(player_container, viewport, "right");
}

function move_backward(player_container, viewport) {
    move_player(player_container, viewport, "left");
}

function updateAnim(player_container, dir) {
    const anim = player_container._anim;
    const dirTextures = player_container._dirTextures;
    if (!anim || !dirTextures) return;

    if (player_container._animDir !== dir) {
        player_container._animDir = dir;
        anim.textures = dirTextures[dir];
        anim.currentFrame = 0;
    }
    if (!anim.playing) anim.play();

    clearTimeout(player_container._idleTimer);
    player_container._idleTimer = setTimeout(() => {
        anim.stop();
        anim.currentFrame = 0; // rest at idle pose
    }, 150);
}

function checkCollision(x, y) {
    // Player buffer (size) approx 30x30
    const w = 30;
    const h = 30;

    for (let c of COLLIDERS) {
        if (x < c.x + c.w &&
            x + w > c.x &&
            y < c.y + c.h &&
            y + h > c.y) {
            return true; // Collision detected
        }
    }
    return false;
}

function move_player(player_container, viewport, direction = "left") {
    // BOUNDS logic is less critical if we have water colliders, but keeping safety bounds is good
    const BOUNDS = {
        minX: 0,
        maxX: 2400, // expanded to full world since colliders handle edges
        minY: 0,
        maxY: 1840,
    };
    const VIEWPORT_MARGIN = 300; 

    let x = player_container.x;
    let y = player_container.y;
    let nextX = x;
    let nextY = y;

    const SPEED = 10;

    if (direction == "left") {
        nextX = Math.max(BOUNDS.minX, x - SPEED);
    }
    if (direction == "right") {
        nextX = Math.min(BOUNDS.maxX, x + SPEED);
    }
    if (direction == "down") {
        nextY = Math.min(BOUNDS.maxY, y + SPEED);
    }
    if (direction == "up") {
        nextY = Math.max(BOUNDS.minY, y - SPEED);
    }

    if (!checkCollision(nextX, nextY)) {
        player_container.position.set(nextX, nextY);
        updateAnim(player_container, direction);

        // Update Viewport
        if (direction == "left" && nextX < viewport.hitArea.x + VIEWPORT_MARGIN) {
            viewport.moveCorner(viewport.hitArea.x - SPEED, viewport.hitArea.y);
        }
        if (direction == "right" && nextX > viewport.hitArea.x + viewport.hitArea.width - VIEWPORT_MARGIN) {
            viewport.moveCorner(viewport.hitArea.x + SPEED, viewport.hitArea.y);
        }
        if (direction == "down" && nextY > viewport.hitArea.y + viewport.hitArea.height - VIEWPORT_MARGIN) {
            viewport.moveCorner(viewport.hitArea.x, viewport.hitArea.y + SPEED);
        }
        if (direction == "up" && nextY < viewport.hitArea.y + VIEWPORT_MARGIN) {
            viewport.moveCorner(viewport.hitArea.x, viewport.hitArea.y - SPEED);
        }
    }
}

function check_zone(player_container) {
    let x = player_container.x;
    let y = player_container.y;
    
    let foundZone = null;

    for (const [key, rect] of Object.entries(turning_rects)) {
        if (
            x > rect.x &&
            y > rect.y &&
            x < rect.x + rect.w &&
            y < rect.y + rect.h
        ) {
            foundZone = key;
            break;
        }
    }

    if (foundZone && foundZone !== currentZone) {
        currentZone = foundZone;
        showNotification();
        console.log("Entered Zone:", currentZone);
    } else if (!foundZone && currentZone) {
        currentZone = null;
        hideNotification();
        console.log("Exited Zone");
    }
}
