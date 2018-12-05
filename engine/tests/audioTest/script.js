import RPGinia from "/src/RPGinia.js";

const engine = new RPGinia;
const app = new engine.app("Test RPGinia app", undefined, [1200, 600]);
const load = new app.Loaders;
const world = new app.World;
const kb = new app.Keyboard;
const audio = new app.AudioManager;

kb.addKey("arrLeft", 37);
kb.addKey("arrRight", 39);
kb.addKey("enter", 13);

audio.add("ruins", "/resources/audio/ruins.mp3");
audio.add("snowy", "/resources/audio/snowy.mp3");
audio.add("snowdin", "/resources/audio/snowdin.mp3");
audio.add("bonetrousle", "/resources/audio/bonetrousle.mp3");
audio.add("waterfall", "/resources/audio/waterfall.mp3");
audio.add("hotland", "/resources/audio/anotherMedium.mp3");

for(let i in audio.list) {
	audio.list[i].volume = 1;
}

// Loading levels
const levelPaths = [
	"/resources/levels/audioTest/audioTest.json",
	"/resources/levels/menu/menu.json",
	"/resources/levels/corridor/corridor.json"
];
const levels = load.jsonFiles("level", levelPaths);

world.initialize({
	levels: levels,
	currentLevelId: 0,
	keyboard: kb,
	audio: audio
});

function loop() {
	app.clearPlayground();

	world.draw();

	requestAnimationFrame(loop);
}
loop();