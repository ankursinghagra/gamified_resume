export function addSprite(resource, x, y, sx, sy) {
    let sp = new PIXI.Sprite(resource);
    sp.position.set(x, y);
    sp.scale.set(sx, sy);
    return sp;
}
