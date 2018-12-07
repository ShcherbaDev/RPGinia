const {app, BrowserWindow} = require('electron');
const electron = require("electron");
let mainWindow;

function createWindow() {
    const screenSizes = [
        electron.screen.getPrimaryDisplay().size.width-20,
        electron.screen.getPrimaryDisplay().size.height-60
    ];

    mainWindow = new BrowserWindow({
        width: screenSizes[0], 
        height: screenSizes[1], 
        center: true,
        frame: false
    })
    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => { mainWindow = null })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    app.quit()
})

app.on('activate', function() {
  if(mainWindow === null) {
    createWindow()
  }
});