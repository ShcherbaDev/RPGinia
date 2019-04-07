// Import engine
import RPGinia from '/src/RPGinia.js';

// Set necessary elements of engine
const engine = new RPGinia();
const app = new engine.App('Test RPGinia app', document.querySelector('canvas#game'));
const loaders = new app.Loaders();
const keyboard = new app.Keyboard();
const audio = new app.AudioManager();
const world = new app.World();

let levelPaths = [];

// Adding keyboard keys
keyboard.addKey('enter', 13);
keyboard.addKey('arrLeft', 37);
keyboard.addKey('arrRight', 39);

// Add audio files
audio.add('languageConfirm', '/resources/audio/languageConfirm.wav');

// Set value of levels array
levelPaths = [
  '/resources/levels/set_language/languagesView.json',
  '/resources/levels/language_confirmed/languageConfirmedView.json'
];

world.initialize({
  app, loaders, keyboard, audio,
  levels: loaders.jsonFile('level', levelPaths[0])
});

// Draw game
function draw() {
  app.clearPlayground();

  world.draw();

  requestAnimationFrame(draw);
}
draw();