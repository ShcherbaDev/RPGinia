import { BrowserWindow } from 'electron';
import * as projectActions from './projectActions';

// Shortcut of function for returning opened at the moment window
const getCurrentWindow = BrowserWindow.getFocusedWindow;

// Shortcut of function for opening website in browser
const openWebPage = require('electron').shell.openExternal;

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { 
                label: 'New project',
                accelerator: 'CommandOrControl+N',
                click() {
                    projectActions.createProject(getCurrentWindow());
                }
            },
            {
                label: 'Open project',
                accelerator: 'CommandOrControl+O',
                click() {
                    projectActions.openProject(getCurrentWindow(), true)
                }
            },
            { type: 'separator' },
            {
                label: 'Save',
                accelerator: 'CommandOrControl+S',
                click() {
                    projectActions.saveProject(getCurrentWindow());
                }
            },
            { type: 'separator' },
            {
                label: 'Settings',
                click() {
                    getCurrentWindow().webContents.send('openModal', 'settings');
                }
            },
            { type: 'separator' },
            { role: 'quit', accelerator: 'CommandOrControl+Q' }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { 
                label: 'Copy',
                accelerator: 'CommandOrControl+C',
                click() {
                    getCurrentWindow().webContents.send('copySelectedObjects');
                }
            },
            { 
                label: 'Paste',
                accelerator: 'CommandOrControl+V',
                click() {
                    getCurrentWindow().webContents.send('pasteSelectedObjects');
                }
            },
            { 
                label: 'Delete',
                accelerator: 'Delete',
                click() {
                    getCurrentWindow().webContents.send('deleteObject');
                }
            }
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'togglefullscreen' },
            { type: 'separator' },
            { role: 'toggleDevTools' }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'RPGinia API documentation',
                click() { openWebPage('https://shcherbadev.github.io/rpginia/docs/api') }
            },
            {
                label: 'RPGinia project editor documentation',
                click() { getCurrentWindow().webContents.send('openModal', 'documentation') }
            },
            { type: 'separator' },
            {
                label: 'Project\'s github',
                click() { openWebPage('https://github.com/ShcherbaDev/RPGinia') }
            }
        ]
    }
]

export default menuTemplate;