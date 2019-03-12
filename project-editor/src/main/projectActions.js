import { writeFileSync, existsSync, readFile } from 'fs';
import { ipcMain, dialog, app } from 'electron';
import { get, has, set } from 'electron-json-storage';
import config from './config';

export function createProject(window) {
    window.webContents.send('openModal', 'createProject');
    ipcMain.once('closeModal', (e, arg) => {
        let data = {};

        let { filePath, appPath, spriteSheetPath, type, name, backgroundColor } = arg;
        filePath = filePath.replace(/\\\\/g, '\\');
        appPath = appPath.replace(/\\\\/g, '\\');
        spriteSheetPath = spriteSheetPath.replace(/\\\\/g, '\\').replace(appPath, '');

        set('projectData', {
            path: filePath,
            appPath,
            type
        });

        if(type === 'level') {
            data.settings = {
                name,
                background: backgroundColor
            };
            data.elements = [];

            if(spriteSheetPath !== '') data.settings.spriteSheetPath = spriteSheetPath;

            writeFileSync(filePath, JSON.stringify(data, null, 2));
        }

        window.setTitle(`${name} - ${config.appName}`);

        e.sender.send('setUpProject', { 
            type, 
            appPath,
            path: filePath,
            data 
        });

        window.reload();
    });
}

export function openProject(window, startFromDialog = false) {
    if(startFromDialog) {
        const openProjectDialog = dialog.showOpenDialog(window, {
            title: 'Open project',
            filters: [
                {
                    name: '.JSON file',
                    extensions: ['json']
                }
            ]
        });

        if(openProjectDialog) {
            const appPathDialog = openAppPathDialog(window);

            if(appPathDialog) {
                const projectFilePath = openProjectDialog[0];
                const appPath = appPathDialog[0];

                readFile(projectFilePath, 'utf8', (error, data) => {
                    if(error) throw error;

                    let projType = '';
                    let projData = JSON.parse(data);

                    // Checking project type 
                    if(projData.elements) projType = 'level'; // If project have elements 

                    else {
                        dialog.showErrorBox('Project type error', 'The program can\'t define the type of project');
                        return false;
                    }

                    window.setTitle(`${projData.settings && projData.settings.name ? projData.settings.name : projectFilePath} - ${config.appName}`);

                    set('projectData', {
                        path: projectFilePath,
                        appPath,
                        type: projType
                    });

                    window.reload();
                });
            } else app.quit();
        }

        else return false;
    }

    else {
        has('projectData', (err, hasKey) => {
            if(err) throw err;
            
            if(hasKey) {
                get('projectData', (error, data) => {
                    if(error) throw error;
                    
                    let { path, appPath, type } = data;
                    
                    if(existsSync(path)) {
                        readFile(path, 'utf8', (loadFileErr, fileData) => {
                            if(loadFileErr) throw loadFileErr;

                            const projectData = JSON.parse(fileData);

                            if(appPath) {
                                window.setTitle(`${projectData.settings.name} - ${config.appName}`);

                                window.webContents.send('setUpProject', { 
                                    type, 
                                    appPath, 
                                    path,
                                    data: projectData 
                                });
                            }

                            else {
                                const appPathDialog = openAppPathDialog(window);

                                if(appPathDialog) {
                                    const appPath = appPathDialog[0];

                                    set('projectData', { path, appPath, type });
                                    
                                    window.setTitle(`${projectData.settings.name} - ${config.appName}`);

                                    window.webContents.send('setUpProject', { 
                                        type, 
                                        appPath,
                                        path,
                                        data: projectData 
                                    });
                                } else app.quit();
                            }
                        });
                    }
                    else window.webContents.send('projectNotExist');
                });
            }

            else window.webContents.send('projectNotExist');
        });
    }
}

export function saveProject(window) {
    window.webContents.send('getProjectData');
    ipcMain.once('getProjectDataResponse', (e, obj) => {
        const store = obj.store;
        let projData = obj.projectData;
        
        get('projectData', (error, data) => {
            if(error) throw error;

            if(data.type === 'level') {
                for(let i in store.projectObjects) {
                    projData.elements[i] = store.projectObjects[i]._settings;

                    if(projData.elements[i].borderCoords) delete projData.elements[i].borderCoords;
                    if(projData.elements[i].centralPointCoords) delete projData.elements[i].centralPointCoords;
                    if(projData.elements[i].image) delete projData.elements[i].image;
                    if(projData.elements[i].isLoaded) delete projData.elements[i].isLoaded;
                    if(projData.elements[i].spriteAnimation) delete projData.elements[i].spriteAnimation;
                }
            }
            writeFileSync(data.path.replace(/\\/g, '\\\\'), JSON.stringify(projData, null, 4));
        });
    });
}

function openAppPathDialog(window) {
    return dialog.showOpenDialog(window, {
        title: 'Choose a path to your RPGinia app',
        properties: ['openDirectory']
    });
}