import { BrowserWindow } from 'electron';
import * as projectActions from './projectActions';

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { 
                label: 'New project',
                accelerator: 'CommandOrControl+N',
                click() {
                    projectActions.createProject(BrowserWindow.getFocusedWindow());
                }
            },
            {
                label: 'Open project',
                accelerator: 'CommandOrControl+O',
                click() {
                    projectActions.openProject(BrowserWindow.getFocusedWindow(), true)
                }
            },
            { type: 'separator' },
            {
                label: 'Save',
                accelerator: 'CommandOrControl+S',
                click() {
                    projectActions.saveProject(BrowserWindow.getFocusedWindow());
                }
            },
            { type: 'separator' },
            {
                label: 'Settings',
                click() {
                    BrowserWindow.getFocusedWindow().send('openModal', 'settings');
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
                    BrowserWindow.getFocusedWindow().send('copySelectedObjects');
                }
            },
            { 
                label: 'Paste',
                accelerator: 'CommandOrControl+V',
                click() {
                    BrowserWindow.getFocusedWindow().send('pasteSelectedObjects');
                }
            },
            { 
                label: 'Delete',
                accelerator: 'Delete',
                click() {
                    BrowserWindow.getFocusedWindow().webContents.send('deleteObject');
                }
            }
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'Help',
        click() { require('electron').shell.openExternal('https://shcherbadev.github.io/rpginia/docs/api') }
    }
]

export default menuTemplate;