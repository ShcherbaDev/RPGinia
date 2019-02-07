import RPGinia from "/src/RPGinia.js";

const engine = new RPGinia();
const app = new engine.App("Test RPGinia app");
const load = new app.Loaders();
const world = new app.World();
const kb = new app.Keyboard();
const cam = new app.Camera();
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
audio.add("phoneRing", "/resources/audio/ring.wav");

const levelPaths = [
    "/resources/levels/set_language/languagesView.json",
    "/resources/levels/dialog/dialogView.json",
    "/resources/levels/corridor/corridor.json"
];

const languagePaths = [
    '/resources/languages/english.json',
    '/resources/languages/russian.json',
    '/resources/languages/ukrainian.json'
];

world.initialize({
    app: app,
    loaders: load,
    levels: load.jsonFile("level", levelPaths[0]),
    keyboard: kb,
    camera: cam,
    audio: audio
});

function draw() {
    app.clearPlayground();
    world.draw();
    requestAnimationFrame(draw);
}
draw();