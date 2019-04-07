import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import { setDataPath, get, set } from 'electron-json-storage';
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
        
        if(method === 'save') {
            dialog.showSaveDialog({
                title: title,
                filters: [
                    { name, extensions }
                ]
            }, path => {
                if(path) {
                    path = path.replace(/\\/g, '\\\\');
                    e.returnValue = path;
                } else e.returnValue = '';
            });
        }

        else if(method === 'open') {
            let settings = { title };

            if(isOpenDirectory) settings.properties = ['openDirectory'];
            else settings.filters = [ { name, extensions } ];

            dialog.showOpenDialog(mainWindow, settings, path => {
                e.returnValue = path ? path[0].replace(/\\/g, '\\\\') : '';
            });
        }
    });

    // Create new project
    ipcMain.on('createProject', e => projectActions.createProject(mainWindow));

    // Open other project via dialog
    ipcMain.on('openProject', e => projectActions.openProject(mainWindow, true));

    // Open modal window
    ipcMain.on('requestModalOpen', (e, type, arg) => e.sender.send('openModal', type, arg));

    // Create new object
    ipcMain.on('createObjectRequest', (e, obj) => e.sender.send('createObject', obj));

    // Sort objects request
    ipcMain.on('sortObjectsByLayersRequest', e => e.sender.send('sortObjectsByLayers'));

    // Repeat object
    ipcMain.on('repeatObjectRequest', (e, arg) => e.sender.send('repeatObject', arg));

    // Set sprite to other
    ipcMain.on('setNewSpriteRequest', (e, arg) => e.sender.send('setSprite', arg));

    // Save app data
    ipcMain.on('saveNewEditorData', (e, arg) => {
        projectActions.saveProject(mainWindow);

        get('editorData', (err, data) => {
            if(err) throw data;

            set('editorData', {
                playground: {
                    sizes: arg['EditorData/playgroundSizes'],
                    autoSizesEnabled: arg['EditorData/autoPlaygroundSizesEnabled']
                }
            });
        });

        mainWindow.reload();
    });

    // Save project data
    ipcMain.on('saveNewProjectData', (e, arg) => {
        projectActions.saveProject(mainWindow);

        get('projectData', (err, data) => {
            if(err) throw err;

            const { path, type } = data;

            set('projectData', {
                path,
                appPath: arg.projectAppPath.replace(/\\\\/g, '\\'),
                type
            });
        });

        mainWindow.reload();
    });
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