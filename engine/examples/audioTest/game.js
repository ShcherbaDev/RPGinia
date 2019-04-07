// Import engine
import RPGinia from '/src/RPGinia.js';

// Set necessary elements of engine
const engine = new RPGinia();
const app = new engine.App('Test RPGinia app', document.querySelector('canvas#game'), [1200, 600]);
const loaders = new app.Loaders();
const keyboard = new app.Keyboard();
const audio = new app.AudioManager();
const world = new app.World();

// Add keyboard keys
keyboard.addKey('arrLeft', 37);
keyboard.addKey('arrRight', 39);
keyboard.addKey('enter', 13);

// Add global variables
app.setGlobalVariable('musicVolume', 100);

// Add music and repeat after their ends
audio.add('ruins', '/resources/audio/ruins.mp3', app.getGlobalVariable('musicVolume'), true);
audio.add('snowy', '/resources/audio/snowy.mp3', app.getGlobalVariable('musicVolume'), true);
audio.add('snowdin', '/resources/audio/snowdin.mp3', app.getGlobalVariable('musicVolume'), true);
audio.add('bonetrousle', '/resources/audio/bonetrousle.mp3', app.getGlobalVariable('musicVolume'), true);
audio.add('waterfall', '/resources/audio/waterfall.mp3', app.getGlobalVariable('musicVolume'), true);
audio.add('anotherMedium', '/resources/audio/anotherMedium.mp3', app.getGlobalVariable('musicVolume'), true);
audio.add('gastersTheme', '/resources/audio/gastersTheme.mp3', app.getGlobalVariable('musicVolume'), true);

world.initialize({
	app, loaders, keyboard, audio,
	levels: loaders.jsonFile('level', '/resources/levels/audio_test/audio_test_view.json')
});

const currentVolume = document.querySelector('p#currentVolume');
const changeVolumeStep = 5;

function setCurrentVolumeText() {
  currentVolume.innerHTML = `Current volume: ${app.getGlobalVariable('musicVolume')}%`;
}
setCurrentVolumeText();

// Change volume function
function setAudiosVolume() {
  const newAudioVolumeValue = app.getGlobalVariable('musicVolume') / 100;

  for(let audioItem of audio.list) {
    audioItem.volume = newAudioVolumeValue;
    audioItem.audio.volume = newAudioVolumeValue;
  }

  setCurrentVolumeText();
}

// Increase volume by pressing the "+" button
document.querySelector('button#increaseVolume').addEventListener('click', () => {
  if(app.getGlobalVariable('musicVolume') !== 100) {
    app.setGlobalVariable('musicVolume', app.getGlobalVariable('musicVolume') + changeVolumeStep);
    setAudiosVolume();
  }
});

// Decrease volume by pressing the "-" button
document.querySelector('button#declineVolume').addEventListener('click', () => {
  if(app.getGlobalVariable('musicVolume') !== 0) {
    app.setGlobalVariable('musicVolume', app.getGlobalVariable('musicVolume') - changeVolumeStep);
    setAudiosVolume();
  }
});

// Draw game
function loop() {
  app.clearPlayground();
  
  world.draw();
  
	requestAnimationFrame(loop);
}
loop();