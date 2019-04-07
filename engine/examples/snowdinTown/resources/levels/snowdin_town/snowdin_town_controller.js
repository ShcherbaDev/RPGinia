// Логічна частина рівня обов'язково повинна бути у функції під назвою controller.
function controller(api) {
  const { app, world, keyboard, camera, audio } = api;
  const background = world.getElementByName('Main background').settings;

  const camSpeed = app.getGlobalVariable('cameraSpeed');
  const minCamX = app.getGlobalVariable('minCameraX');
  const maxCamX = app.getGlobalVariable('maxCameraX');

  const backgroundMovementSpeed = camSpeed/20;

  const handleKeyboard = () => {
    if(keyboard.isPressed('arrLeft') && camera.x <= minCamX) {
      camera.move(camSpeed, 0);
      background.coords[0] = background.coords[0] + backgroundMovementSpeed;
    }

    if(api.keyboard.isPressed('arrRight') && camera.x >= maxCamX) {
      camera.move(-camSpeed, 0);
      background.coords[0] = background.coords[0] - backgroundMovementSpeed;
    }

    requestAnimationFrame(handleKeyboard);
  }

  if(world.currentLevelName === 'Snowdin town') {
    // Через 100 мс. - увімкнути фонову музику.
    setTimeout(() => {
      audio.play('backgroundMusic');
    }, 100);
    handleKeyboard();
  }

  else {
    audio.stop('backgroundMusic');
    cancelAnimationFrame(handleKeyboard);
  }
}