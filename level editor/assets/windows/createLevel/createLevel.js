const {ipcRenderer} = require("electron");

const levelNameInput = document.querySelector(".modal_content > .form_group > input#levelName");
const chooseButtons = document.querySelectorAll(".modal_content > .form_group > .input_file > .choose_button > button");
const filePaths = document.querySelectorAll(".modal_content > .form_group > .input_file > .path > p");
const levelBackgroundColor = document.querySelector(".modal_content > .form_group > input#levelBackgroundColor");
const createButton = document.querySelector(".modal_content > button.bottom_right_button");

chooseButtons.forEach((elem, key) => {
    elem.addEventListener("click", () => {
        ipcRenderer.send("chooseButtonClicked", {
            clickedElementId: elem.id,
            clickedElementKey: key
        });

        ipcRenderer.on("chooseButtonClicked", (event, arg) => {
            filePaths[arg[0]].innerHTML = arg[1];
        });
    });
});

createButton.addEventListener("click", () => {
    if(levelNameInput.value !== "" && filePaths[0].textContent !== "Folder not choosed" && filePaths[1].textContent !== "File not choosed") {
        ipcRenderer.send("createLevel", {
            levelName: levelNameInput.value,
            levelPath: `${filePaths[0].textContent}`,
            spriteSheetPath: filePaths[1].textContent !== "File not choosed" ? `${filePaths[1].textContent}` : "undefined",
            controllerPath: filePaths[2].textContent !== "File not choosed" ? `${filePaths[2].textContent}` : "undefined",
            backgroundColor: levelBackgroundColor.value
        });
    }
});