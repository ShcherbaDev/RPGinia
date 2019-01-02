import RPGinia from "/src/RPGinia.js";

const engine = new RPGinia();
const app = new engine.App("Test RPGinia app");
const load = new app.Loaders();
const world = new app.World();
const kb = new app.Keyboard();
const pl = new app.Player();
const cam = new app.Camera(world);
const audio = new app.AudioManager();

kb.addKey("enter", 13);
kb.addKey("space", 32);
kb.addKey("arrUp", 38);
kb.addKey("arrDown", 40);
kb.addKey("arrLeft", 37);
kb.addKey("arrRight", 39);
kb.addKey("shift", 16);
kb.addKey("controlLeft", 17);

audio.add("languageConfirm", "/resources/audio/languageConfirm.wav");

const levelPaths = [
    "/resources/levels/set_language/languages.json",
    "/resources/levels/corridor/corridor.json"
];



// pl.spriteSheet = load.jsonFile("spriteSheet", "/resources/sprites/player/player.json");
pl.sizes = [40, 55];

world.initialize({
    app: app,
    levels: load.jsonFile("level", levelPaths[0]),
    keyboard: kb,
    currentLevelId: 0,
    player: pl,
    camera: cam,
    audio: audio
});

function draw() {
    app.clearPlayground();
    world.draw();
    requestAnimationFrame(draw);
}
draw();