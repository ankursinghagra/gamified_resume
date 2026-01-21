import { WORLD_WIDTH, WORLD_HEIGHT, turning_rects } from './app_config.js';
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
