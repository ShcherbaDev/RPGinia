import RPGinia from "/src/RPGinia.js";

const engine = new RPGinia();
const app = new engine.App("Test RPGinia app");
const load = new app.Loaders();
const world = new app.World();
const kb = new app.Keyboard();
const pl = new app.Player();
const cam = new app.Camera(world);

kb.addKey("enter", 13);
kb.addKey("space", 32);
kb.addKey("arrUp", 38);
kb.addKey("arrDown", 40);
kb.addKey("arrLeft", 37);
kb.addKey("arrRight", 39);
kb.addKey("shift", 16);
kb.addKey("controlLeft", 17);

const levelPaths = [
    "/resources/levels/menu/menu.json",
    "/resources/levels/corridor/corridor.json"
];
const levels = load.jsonFiles("level", levelPaths);

pl.spriteSheet = load.jsonFile("spriteSheet", "/resources/sprites/player/player.json");
pl.sizes = [40, 55];

world.initialize({
    app: app,
    levels: levels,
	currentLevelId: 1,
    keyboard: kb,
    player: pl,
    camera: cam
});

function draw() {
    app.clearPlayground();
    world.draw();
    requestAnimationFrame(draw);
}
draw();