const electron = require("electron");
const fs = require("fs");
let mainWindow;
let modalWindows = [];

let settings = {
    theme: "dark"
};

let viewData = null;
let viewPath = null;
let spriteSheetData = null;

function setTitle(title, end) {
    mainWindow.setTitle(title + end);
}

function registerShortcut(shortcut, callback) {
    electron.globalShortcut.register(shortcut, callback);
}

function createModal(fileName, sizes, resizable = false) {
    modalWindows.push({
        name: fileName,
        browserWin: new electron.BrowserWindow({
            parent: mainWindow,
            modal: true,
            show: false,
            width: sizes[0],
            height: sizes[1],
            resizable: resizable
        })
    });
    let lastModal = modalWindows[modalWindows.length-1];
    // lastModal.browserWin.setMenu(null);
    lastModal.browserWin.webContents.openDevTools();
    lastModal.browserWin.loadURL(`file://${__dirname}/assets/windows/${fileName}/${fileName}.html`);
    lastModal.browserWin.once("ready-to-show", () => {
        lastModal.browserWin.show();
    });
    lastModal.browserWin.on("closed", () => { lastModal = null });
    return lastModal;
}

function closeModal(name) {
    modalWindows[modalWindows.findIndex(e => e.name === name)].browserWin.close();
    modalWindows[modalWindows.findIndex(e => e.name === name)] = null;
}

function createLevel() { createModal("createLevel", [835, 710]) }

function openLevel() {
    electron.dialog.showOpenDialog(mainWindow, {
        title: "Sprite sheet path",
        filters: [ { name: "JSON file", extensions: ["json"] } ],
        properties: ["openFile"]
    }, (filePath) => {
        fs.readFile(filePath[0].replace(/\\/g, "/"), (viewErr, view) => {
            if(viewErr) throw viewErr;
            
            viewPath = filePath[0].replace(/\\/g, "/");
            viewData = JSON.parse(view);

            if(viewData.settings.spriteSheetPath !== "undefined" && viewData.settings.spriteSheetPath !== undefined) {
                fs.readFile(viewData.settings.spriteSheetPath, (sprErr, sprSheet) => {
                    if(sprErr) throw sprErr;

                    spriteSheetPath = viewData.settings.spriteSheetPath;
                    spriteSheetData = JSON.parse(sprSheet);

                    mainWindow.webContents.send("createLevelApproved", {
                        view: viewData,
                        spriteSheet: spriteSheetData
                    });
                });       
            }

            else {
                mainWindow.webContents.send("createLevelApproved", {
                    view: viewData,
                    spriteSheet: null
                });
            }

            setTitle(viewData.settings.name, " - RPGinia level editor");
        });
    });
}

function createWindow() {
    mainWindow = new electron.BrowserWindow({ center: true });
    mainWindow.maximize();

    // Open main editor window
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.webContents.openDevTools();
    mainWindow.on("closed", () => { mainWindow = null });

    // Build custom menu
    const menu = electron.Menu.buildFromTemplate([
        {
            label: "File",
            submenu: [
                {
                    label: "New project",
                    accelerator: "CmdOrCtrl+N",
                    click: createLevel
                },
                {
                    label: "Open project",
                    accelerator: "CmdOrCtrl+O",
                    click: openLevel
                },
                { type: "separator" },
                {
                    label: "Save",
                    accelerator: "CmdOrCtrl+S"
                },
                {
                    label: "Save as...",
                    accelerator: "CmdOrCtrl+Alt+S"
                },
                { type: "separator" },
                { role: "quit" }
            ]
        },
        {
            label: "Edit"
        },
        {
            label: "Window"
        },
        {
            label: "View"
        },
        {
            label: "Help",
            submenu: [
                {
                    label: "RPGinia documentation",
                    click() { require("electron").shell.openExternal("https://shcherbadev.github.io/rpginia/docs/") }
                },
                {
                    label: "Level editor documentation",
                    click() { require("electron").shell.openExternal("https://shcherbadev.github.io/rpginia/docs/editor") }
                }
            ]
        },
        {
            label: "Developer tools",
            submenu: [
                { role: "reload" },
                { role: "forcereload" },
                { role: "toggledevtools" }
            ]
        }
    ]);
    electron.Menu.setApplicationMenu(menu);

    mainWindow.webContents.on("did-finish-load", () => {
        mainWindow.webContents.send("setPlaygroundSizes", "...");
    });

    // mainWindow.webContents.on("did-finish-load", () => {
    //     mainWindow.webContents.send("createLevelApproved", {
    //         view: JSON.parse(`{
    //             "settings": {
    //                 "name": "Last corridor",
    //                 "spriteSheetPath": "/resources/sprites/spriteSheets.json",
    //                 "background": "#000000"
    //             },
    //             "elements": [   
    //                 {
    //                     "name": "Corridor",
    //                     "type": "sprite",
    //                     "spriteSheetIndex": 1,
    //                     "spriteIndex": 0,
    //                     "coords": [150, 0, 3043, 490]
    //                 },
    //                 {
    //                     "name": "Save point",
    //                     "type": "sprite",
    //                     "spriteSheetIndex": 1,
    //                     "spriteIndex": 2,
    //                     "frameTo": 1,
    //                     "interval": 500,
    //                     "isRepeat": true,
    //                     "coords": [210, 399, 32, 32]
    //                 }
    //             ]
    //         }`)
    //     });
    // });
}

electron.app.on("ready", createWindow);

electron.app.on("window-all-closed", () => {
    electron.app.quit();
});

electron.app.on("activate", () => {
    if(mainWindow === null)
        createWindow();
});

electron.ipcMain.on("chooseButtonClicked", (event, arg) => {
    if(arg.clickedElementId === "projectPath") {
        electron.dialog.showOpenDialog(modalWindows[modalWindows.findIndex(e => e.name === "createLevel")].browserWin, {
            title: "Project path",
            properties: ["openDirectory"]
        }, (filePath) => {
            event.sender.send("chooseButtonClicked", [0, filePath[0].replace(/\\/g, "/")]);
        });
    }

    if(arg.clickedElementId === "levelPath") {
        electron.dialog.showSaveDialog(modalWindows[modalWindows.findIndex(e => e.name === "createLevel")].browserWin, {
            title: "New level path",
            filters: [ { name: "JSON file", extensions: ["json"] } ]
        }, (filePath) => {
            event.sender.send("chooseButtonClicked", [1, filePath.replace(/\\/g, "/")]);
        });
    }

    if(arg.clickedElementId === "spriteSheetPath") {
        electron.dialog.showOpenDialog(modalWindows[modalWindows.findIndex(e => e.name === "createLevel")].browserWin, {
            title: "Sprite sheet path",
            filters: [ { name: "JSON file", extensions: ["json"] } ],
            properties: ["openFile"]
        }, (filePath) => {
            event.sender.send("chooseButtonClicked", [2, filePath[0].replace(/\\/g, "/")]);
        });
    }
});

electron.ipcMain.on("createLevel", (event, arg) => {
    viewPath = arg.levelPath;
    viewData = {
        settings: {
            name: toString(arg.levelName),
            spriteSheetPath: toString(arg.spriteSheetPath),
            background: toString(arg.backgroundColor)
        },
        elements: []
    };

    fs.writeFile(viewPath, viewData, (err) => {
        if(err) throw err;

        closeModal("createLevel");
        setTitle(arg.levelName, " - RPGinia level editor");
        console.info(`New level created: ${arg.levelName}\nLevel path: file://${arg.levelPath}`)
    
        if(arg.spriteSheetPath !== "undefined") {
            fs.readFile(arg.spriteSheetPath, (err, data) => {
                if(err) throw err;
                spriteSheetData = JSON.parse(data);
            });
        }

        mainWindow.webContents.send("createLevelApproved", {
            view: viewData,
            spriteSheet: spriteSheetData
        });
    });
});