// Import engine
import RPGinia from '/src/RPGinia.js';

// Set necessary elements of engine
const engine = new RPGinia();
const app = new engine.App('Town created via RPGinia project editor', document.querySelector('canvas#game'));
const loaders = new app.Loaders();
const keyboard = new app.Keyboard();
const audio = new app.AudioManager();
const world = new app.World();
const camera = new app.Camera();

// Adding keyboard keys
keyboard.addKey('arrUp', 38);
keyboard.addKey('arrDown', 40);
keyboard.addKey('arrLeft', 37);
keyboard.addKey('arrRight', 39);

// Add global variables
app.setGlobalVariable('cameraSpeed', 5);
app.setGlobalVariable('minCameraX', -1);
app.setGlobalVariable('maxCameraX', -3677);

// Add background music audio with volume 50% and repeat after it ends
audio.add('backgroundMusic', '/resources/audio/snowdin_town.mp3', 50, true);

world.initialize({
  app, loaders, keyboard, audio, camera,
  levels: loaders.jsonFile('level', '/resources/levels/snowdin_town/snowdin_town_view.json')
});

// Draw game
function loop() {
  app.clearPlayground();

  world.draw();

  requestAnimationFrame(loop);
}
loop();