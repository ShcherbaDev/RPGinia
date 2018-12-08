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


const hamburgerBtn = document.querySelector(".custom_frame > .navigation > button#navigation_toggle");
const navDropdown = document.querySelector(".custom_frame > .navigation > ul#navigation_dropdown");
let isNavigationOpened = false;
hamburgerBtn.addEventListener("click", (e) => {
    if(isNavigationOpened) {
        isNavigationOpened = false;
        navDropdown.style.display = "none";
        hamburgerBtn.style.backgroundColor = "transparent";
    }
    else {
        isNavigationOpened = true;
        navDropdown.style.display = "block";
        hamburgerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    }
});