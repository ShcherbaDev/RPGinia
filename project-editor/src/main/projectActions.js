import { writeFileSync, existsSync, readFile } from 'fs';
import { ipcMain, dialog } from 'electron';
import { get, has, set } from 'electron-json-storage';
import config from './config';

export function createProject(window) {
    window.webContents.send('openModal', 'createProject');
    ipcMain.once('createProjectRequest', (e, arg) => {
        let data = {};

        let { filePath, appPath, spriteSheetPath, controllerPath, type, name, backgroundColor } = arg;
        
        filePath = filePath.replace(/\\\\/g, '\\');
        appPath = appPath.replace(/\\\\/g, '\\');
        spriteSheetPath = spriteSheetPath.replace(/\\\\/g, '\\').replace(appPath, '');
        controllerPath = controllerPath.replace(/\\\\/g, '\\').replace(appPath, '');

        createEditorDataFile();
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
            if(controllerPath !== '') data.settings.controllerPath = controllerPath;

            writeFileSync(filePath, JSON.stringify(data, null, 2));
        }

        window.setTitle(`${name} - ${config.appName}`);

        window.reload();
    });
}

export function openProject(window, startFromDialog = false) {
    if(startFromDialog) {
        const appPathDialog = openAppPathDialog(window);

        if(appPathDialog) {
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
                const projectFilePath = openProjectDialog[0];
                const appPath = appPathDialog[0];

                readFile(projectFilePath, 'utf8', (error, data) => {
                    if(error) throw error;

                    let projType = '';
                    let projData = JSON.parse(data);

                    // Check project type 
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
            }

            else {
                return false;
            }
        }

        else {
            return false;
        }
    }

    else {
        has('projectData', (err, hasKey) => {
            if(err) throw err;
            
            // If has found projectData.json
            if(hasKey) {
                get('projectData', (error, configData) => {
                    if(error) throw error;
                    
                    // If the file is exist
                    if(existsSync(configData.path)) {
                        let { path, appPath, type } = configData;

                        readFile(path, 'utf8', (loadFileErr, fileData) => {
                            if(loadFileErr) throw loadFileErr;

                            const projectData = JSON.parse(fileData);

                            // If have RPGinia app path - open project
                            if(appPath) {
                                window.setTitle(`${projectData.settings.name} - ${config.appName}`);

                                createEditorDataFile();

                                setUpProject(window, { type, appPath, path, projectData });
                            }

                            // Request RPGinia app path
                            else {
                                const appPathDialog = openAppPathDialog(window);

                                // If it was mentioned - open project
                                if(appPathDialog) {
                                    const appPath = appPathDialog[0];

                                    createEditorDataFile();
                                    set('projectData', { path, appPath, type });
                                    
                                    window.setTitle(`${projectData.settings.name} - ${config.appName}`);
                                    
                                    setUpProject(window, { type, appPath, path, projectData });
                                } 

                                // If it wasn't mentioned.
                                else window.webContents.send('projectNotExist');
                            }
                        });
                    }
                    else window.webContents.send('projectNotExist'); // If the file is not exist
                });
            }
            else window.webContents.send('projectNotExist'); // If wasn't found projectData.json
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

function createEditorDataFile() {
    has('editorData', (err, hasKey) => {
        if(err) throw err;

        if(!hasKey) {
            set('editorData', {
                playground: {
                    sizes: [0, 0],
                    autoSizesEnabled: true
                }
            });
            return;
        }
        else {
            return;
        }
    });
}

function setUpProject(window, obj) {
    const { type, appPath, path, projectData } = obj;

    get('editorData', (err, editorData) => {
        if(err) throw err;

        window.webContents.send('setUpProject', { 
            type, 
            appPath,
            editorData,
            path,
            data: projectData 
        });
    });
}