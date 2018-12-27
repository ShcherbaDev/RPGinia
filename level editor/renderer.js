const {ipcRenderer} = require("electron");

const playgroundBlock = document.querySelector(".editor > .block.playground .canvas_container");
const playground = document.querySelector(".editor > .block.playground canvas#playground");
const context = playground.getContext("2d");

let view = null;
let spriteSheet = null;
let isPlaygroundWorking = false;

ipcRenderer.on("setPlaygroundSizes", () => { setupCanvasSizes() });
ipcRenderer.on("createLevelApproved", (event, data) => { setupCanvas(data.view, data.spriteSheetData) });

function setupCanvasSizes() {
    playground.width = playgroundBlock.clientWidth;
    playground.height = playgroundBlock.clientHeight >= 636 ? playgroundBlock.clientHeight/1.5 : playgroundBlock.clientHeight;
}

function setupCanvas(viewArg, spriteSheetArg) {
    setupCanvasSizes();

    view = viewArg;
    spriteSheet = spriteSheetArg;
    isPlaygroundWorking = true;

    function draw() {
        if(isPlaygroundWorking) {
            context.clearRect(0, 0, playground.width, playground.height);

            // Background draw
            context.fillStyle = view.settings.background || "#000000";
            context.fillRect(0, 0, playground.width, playground.height);
            
            requestAnimationFrame(draw);
        }
    }
    draw();
}

window.addEventListener("resize", () => {
    setupCanvasSizes();
});