import { WORLD_WIDTH, WORLD_HEIGHT, turning_rects, COLLIDERS } from './app_config.js';
import { addSprite } from './utils.js';

export async function add_Water_bg(resources) {
    var bg_water = new PIXI.Container();
    bg_water.label = "Water";

    let graphics = new PIXI.Graphics();
    graphics.beginFill(0xc0d470);
    graphics.drawRect(300, 300, WORLD_WIDTH, WORLD_HEIGHT);
    bg_water.addChild(graphics);

    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 23; j++) {
            if (i > 6 && i < 20 && j > 6 && j < 18) continue;
            let anim = new PIXI.AnimatedSprite(
                resources.Water_Anim_json.animations.Water
            );
            anim.position.set(i * 80, j * 80);
            anim.animationSpeed = 1 / 10;
            anim.loop = true;
            anim.play();
            bg_water.addChild(anim);
        }
    }

    return bg_water;
}

export async function add_ground(resources) {
    var bg_land = new PIXI.Container();
    bg_land.label = "Land";

    bg_land.addChild(addSprite(resources["Land_Layer"], 0, 0, 0.5, 0.5));
    bg_land.addChild(addSprite(resources["Village_Layer"], 0, 0, 1.5, 1.5));

    // Debug boxes removed for production polish
    // If needed for debugging, look at turning_rects in app_config.js

    // --- Notice Boards at each hotspot ---
    const boards = [
        { zone: 'NW', label: 'Skills'    },
        { zone: 'NE', label: 'About Me'  },
        { zone: 'SW', label: 'Projects'  },
        { zone: 'SE', label: 'Contact'   },
    ];

    for (const { zone, label } of boards) {
        const rect = turning_rects[zone];
        const boardContainer = new PIXI.Container();

        // Board sprite — centred on the hotspot rect
        const board = new PIXI.Sprite(resources['notice_board']);
        board.anchor.set(0.5);
        const boardScale = Math.min(rect.w / board.texture.width, rect.h / board.texture.height) * 1.1;
        board.scale.set(boardScale);
        board.x = rect.x + rect.w / 2;
        board.y = rect.y + rect.h / 2;
        boardContainer.addChild(board);

        // Text label on the board
        const text = new PIXI.Text(label, {
            fontFamily: 'Press Start 2P',
            fontSize: 18,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 3,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: board.texture.width * boardScale * 0.7,
        });
        text.anchor.set(0.5);
        text.x = board.x;
        text.y = board.y - 2;
        boardContainer.addChild(text);

        bg_land.addChild(boardContainer);
    }

    // --- Visual Hotspots ---
    // NE: About Me (NPC)
    const npc = addSprite(resources["npc_guide"], turning_rects.NE.x, turning_rects.NE.y, 0.4, 0.4);
    bg_land.addChild(npc);

    // NW: Skills (Signpost)
    const sign = addSprite(resources["signpost"], turning_rects.NW.x, turning_rects.NW.y, 0.4, 0.4);
    bg_land.addChild(sign);

    // SE: Contact (Mailbox)
    const mailbox = addSprite(resources["mailbox"], turning_rects.SE.x, turning_rects.SE.y, 0.4, 0.4);
    bg_land.addChild(mailbox);

    // SW: Projects (Workbench)
    const workbench = addSprite(resources["workbench"], turning_rects.SW.x, turning_rects.SW.y, 0.4, 0.4);
    bg_land.addChild(workbench);

    return bg_land;
}

export async function add_frame(resources) {
    var frame_container = new PIXI.Container();
    frame_container.label = "Frame";

    frame_container.addChild(addSprite(resources["heart"], 10, 10, 2, 2));
    frame_container.addChild(addSprite(resources["heart"], 60, 10, 2, 2));
    frame_container.addChild(addSprite(resources["heart"], 110, 10, 2, 2));

    return frame_container;
}

export function create_debug_overlay() {
    const overlay = new PIXI.Container();
    overlay.label = "DebugOverlay";

    const g = new PIXI.Graphics();

    // Walkable land area — light green
    g.beginFill(0x44ff44, 0.18);
    g.drawRect(230, 230, 2070 - 230, 1240 - 230);
    g.endFill();

    // Colliders (blocked zones) — red
    for (const c of COLLIDERS) {
        g.lineStyle(1, 0xff2222, 0.9);
        g.beginFill(0xff2222, 0.45);
        g.drawRect(c.x, c.y, c.w, c.h);
        g.endFill();
    }
    g.lineStyle(0);

    // Interaction zones (turning_rects) — yellow outline + fill
    for (const [, rect] of Object.entries(turning_rects)) {
        g.lineStyle(2, 0xffee00, 1);
        g.beginFill(0xffee00, 0.35);
        g.drawRect(rect.x, rect.y, rect.w, rect.h);
        g.endFill();
    }
    g.lineStyle(0);

    overlay.addChild(g);

    // Zone labels — drawn on top of graphics
    for (const [key, rect] of Object.entries(turning_rects)) {
        const label = new PIXI.Text(key, {
            fontFamily: 'Press Start 2P',
            fontSize: 16,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 4,
        });
        label.anchor.set(0.5);
        label.position.set(rect.x + rect.w / 2, rect.y + rect.h / 2);
        overlay.addChild(label);
    }

    return overlay;
}
