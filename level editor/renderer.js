const {remote, ipcRenderer} = require("electron");

document.querySelector(".custom_frame > .controls > button#minimize").addEventListener("click", (e) => {
    remote.getCurrentWindow().minimize();
});

document.querySelector(".custom_frame > .controls > button#resize").addEventListener("click", (e) => {
    const currentWindow = remote.getCurrentWindow();
    if(currentWindow.isMaximized())
        currentWindow.unmaximize();
    else
        currentWindow.maximize();
});

document.querySelector(".custom_frame > .controls > button#close").addEventListener("click", (e) => {
    remote.app.quit();
});