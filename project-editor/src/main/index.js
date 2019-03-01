import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import { join } from 'path';
import { tmpdir } from 'os';
import { setDataPath } from 'electron-json-storage';
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

    // Defining custom menu
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Setting up path for saving project data (In Temp)
    setDataPath(join(tmpdir(), 'RPGinia project editor'));

    mainWindow.webContents.on('did-finish-load', () => {
        // Try to open existing project
        projectActions.openProject(mainWindow);
    });

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

    // Open other project via dialog
    ipcMain.on('openProject', e => {
        projectActions.openProject(mainWindow, true);
    });

    // Open modal window
    ipcMain.on('requestModalOpen', (e, type) => {
        e.sender.send('openModal', type);
    });

    // Create new object
    ipcMain.on('createObjectRequest', (e, obj) => {
        e.sender.send('createObject', obj);
    });

    // Delete object
    ipcMain.on('requestDeleteObject', (e, index) => {
        e.sender.send('deleteObject', index);
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if(mainWindow === null) createWindow();
});