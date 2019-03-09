import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import { setDataPath } from 'electron-json-storage';
import menuTemplate from './customMenu';
import * as projectActions from './projectActions';
import config from './config';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if(process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
// const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file:///${__dirname}/index.html`;

function createWindow() {
    // Initial window options
    mainWindow = new BrowserWindow({
        minWidth: 1095,
        minHeight: 650,
        webPreferences: {
            webSecurity: false
        }
    });
    mainWindow.loadURL(config.appPath);
    mainWindow.maximize();

    mainWindow.on('closed', () => mainWindow = null);

    // Defining custom menu
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // Setting up path for saving project data (In Temp)
    setDataPath(config.appDataPath);

    mainWindow.webContents.on('did-finish-load', () => {
        // Try to open existing project
        // If open is successful - opening main editor window
        // Else - opening choice with creating/opening project
        projectActions.openProject(mainWindow);
    });

    // ipcMain events
    // Event for custom file input
    ipcMain.on('requestChooseFile', (e, arg) => {
        const { title, method, name, isOpenDirectory, extensions } = arg;
        console.log()
        if(method === 'save') {
            dialog.showSaveDialog({
                title: title,
                filters: [
                    { name, extensions }
                ]
            }, path => {
                if(path) {
                    console.log(path)
                    path = path.replace(/\\/g, '\\\\');
                    e.returnValue = path;
                } else e.returnValue = 'File is not choosed';
            });
        }

        else if(method === 'open') {
            let settings = {
                title: title
            };

            if(isOpenDirectory) settings.properties = ['openDirectory'];
            else settings.filters = [ { name, extensions } ];

            dialog.showOpenDialog(mainWindow, settings, path => {
                if(path) e.returnValue = path[0].replace(/\\/g, '\\\\');
                else {
                    if(isOpenDirectory) e.returnValue = 'Directory is not choosed';
                    else e.returnValue = 'File is not choosed';
                }
            });
        }
    });

    // Create new project
    ipcMain.on('createProject', e => projectActions.createProject(mainWindow));

    // Open other project via dialog
    ipcMain.on('openProject', e => projectActions.openProject(mainWindow, true));

    // Open modal window
    ipcMain.on('requestModalOpen', (e, type) => e.sender.send('openModal', type));

    // Create new object
    ipcMain.on('createObjectRequest', (e, obj) => e.sender.send('createObject', obj));

    // Delete object
    ipcMain.on('requestDeleteObject', (e, index) => e.sender.send('deleteObject', index));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if(mainWindow === null) {
        createWindow();
    }
});