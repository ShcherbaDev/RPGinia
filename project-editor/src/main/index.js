import { app, BrowserWindow, ipcMain, dialog, Menu, globalShortcut } from 'electron';
import * as path from 'path';
import * as os from 'os';
import * as storage from 'electron-json-storage';
import menuTemplate from './customMenu';
import * as projectActions from './projectActions';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
    // Initial window options
    mainWindow = new BrowserWindow({
        minWidth: 1095,
        minHeight: 650
    });
    mainWindow.loadURL(winURL);
    mainWindow.maximize();
    
    mainWindow.webContents.openDevTools();

    // Define custom menu
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });


    storage.setDataPath(path.join(os.tmpdir(), 'RPGinia project editor'));
    mainWindow.webContents.on('did-finish-load', () => {
        projectActions.openProject(mainWindow);

        // Register shortcuts
        // globalShortcut.register('CommandOrControl+S', () => {
        //     projectActions.saveProject(mainWindow);
        // });
    })

    // ipcMain events
    // Event for custom file input
    ipcMain.on('requestChooseFile', (e, arg) => {
        dialog.showSaveDialog({
            title: 'Choose project path',
            filters: [
                { name: arg.extensionLabel, extensions: [arg.extension] }
            ]
        }, filePath => {
            if(filePath !== undefined) {
                filePath = filePath.replace(/\\/g, '\\\\');
                e.returnValue = filePath;
            }
            else return false;
        });
    });

    // Create new project
    ipcMain.on('createProject', e => {
        projectActions.createProject(mainWindow);
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});