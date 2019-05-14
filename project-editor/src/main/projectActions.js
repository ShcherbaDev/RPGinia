import { writeFileSync, existsSync, readFile } from 'fs';
import { ipcMain, dialog } from 'electron';
import { get, has, set } from 'electron-json-storage';
import config from './config';

// Function for creating new project
export function createProject(window) {
    window.webContents.send('openModal', 'createProject');
    ipcMain.once('createProjectRequest', (e, arg) => {
        let data = {};

        let { filePath, appPath, spriteSheet, controllerPath, type, name, backgroundColor } = arg;
        
        filePath = filePath.replace(/\\\\/g, '\\');
        appPath = appPath.replace(/\\\\/g, '\\');
        spriteSheet = spriteSheet.replace(/\\\\/g, '\\').replace(appPath, '');
        controllerPath = controllerPath.replace(/\\\\/g, '\\').replace(appPath, '');

        // Set up necessary data
        createEditorDataFile(() => {
            set('projectData', {
                path: filePath,
                appPath,
                type
            });

            // Set up settings for level
            if(type === 'level') {
                data.settings = {
                    name,
                    background: backgroundColor
                };
                data.elements = [];

                if(spriteSheet !== '') data.settings.spriteSheetPath = spriteSheet;
                if(controllerPath !== '') data.settings.controllerPath = controllerPath;

                writeFileSync(filePath, JSON.stringify(data, null, 2));
            }

            // Set up editor title
            window.setTitle(`${name} - ${config.appName}`);

            // Reload editor to call openProject function
            window.reload();
        });
    });
}

// Function for opening existing project
export function openProject(window, startFromDialog = false) {
    // If the user has self-activated the function 
    if(startFromDialog) {
        const appPathDialog = openAppPathDialog(window);

        // If user has selected path to his app
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

            // If user has selected level path
            if(openProjectDialog) {
                const projectFilePath = openProjectDialog[0];
                const appPath = appPathDialog[0];

                readFile(projectFilePath, 'utf8', (error, data) => {
                    if(error) throw error;

                    let projectType = '';
                    let projectData = JSON.parse(data);

                    // Check project type 
                    if(projectData.elements) projectType = 'level'; // If project have elements 

                    else {
                        dialog.showErrorBox('Project type error', 'The program can\'t define the type of project');
                        return false;
                    }

                    // Set project data and reload editor to avoid errors
                    set('projectData', {
                        path: projectFilePath,
                        appPath,
                        type: projectType
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
                                let projectObject = { 
                                    type, appPath, path, projectData, spriteSheetPath: ''
                                };

                                if (projectData.settings.spriteSheetName !== undefined && projectData.settings.spriteSheetPath === undefined) {
                                    const requestSpriteSheet = openSpriteSheetDialog(window, projectData.settings.spriteSheetName);
            
                                    if (requestSpriteSheet) {
                                        projectObject.spriteSheetPath = requestSpriteSheet[0];
                                    }
                                    else {
                                        window.webContents.send('projectNotExist');
                                    }
                                }

                                createEditorDataFile(() => {
                                    window.setTitle(`${projectData.settings.name} - ${config.appName}`);
                                    setUpProject(window, projectObject);
                                });
                            }

                            // Request RPGinia app path
                            else {
                                const appPathDialog = openAppPathDialog(window);

                                // If was selected RPGinia app path - open project
                                if(appPathDialog) {
                                    const appPath = appPathDialog[0];

                                    let projectObject = {
                                        type, appPath, path, projectData, spriteSheetPath: ''
                                    }

                                    if (projectData.settings.spriteSheetName !== undefined && projectData.settings.spriteSheetPath === undefined) {
                                        const requestSpriteSheet = openSpriteSheetDialog(window, projectData.settings.spriteSheetName);
                
                                        if (requestSpriteSheet) {
                                            projectObject.spriteSheetPath = requestSpriteSheet[0];
                                        }
                                        else {
                                            window.webContents.send('projectNotExist');
                                        }
                                    }

                                    createEditorDataFile(() => {
                                        set('projectData', { path, appPath, type });
                                    
                                        window.setTitle(`${projectData.settings.name} - ${config.appName}`);
                                        setUpProject(window, projectObject);
                                    });
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

// Function for saving project
export function saveProject(window) {
    /**
     * Gets project data from store.
     * When gets answer - saves project.
     */
    window.webContents.send('getProjectData');
    ipcMain.once('getProjectDataResponse', (e, obj) => {
        const store = obj.store;
        let projData = obj.projectData;
        
        get('projectData', (error, data) => {
            if(error) throw error;

            if(data.type === 'level') {
                for(let i in store.projectObjects) {
                    projData.elements[i] = store.projectObjects[i]._settings;

                    // Do not write data which are used while engine is working
                    if(projData.elements[i].borderCoords) delete projData.elements[i].borderCoords;
                    if(projData.elements[i].centralPointCoords) delete projData.elements[i].centralPointCoords;
                    
                    if(projData.elements[i].type === 'sprite') {
                        if(projData.elements[i].image) delete projData.elements[i].image;
                        if(projData.elements[i].isLoaded) delete projData.elements[i].isLoaded;
                        if(projData.elements[i].settings.spriteAnimation) delete projData.elements[i].settings.spriteAnimation;
                    }
                }
            }

            // Write changes into project
            writeFileSync(data.path.replace(/\\/g, '\\\\'), JSON.stringify(projData, null, 4));
        });
    });
}

// Function for opening dialog for selecting RPGinia app path
function openAppPathDialog(window) {
    return dialog.showOpenDialog(window, {
        title: 'Choose a path to your RPGinia app',
        properties: ['openDirectory']
    });
}

// Function for writing default editor settings, if they are not exist.
function createEditorDataFile(callback) {
    has('editorData', (err, hasKey) => {
        if(err) throw err;

        if(!hasKey) {
            set('editorData', {
                playground: {
                    sizes: [0, 0],
                    autoSizesEnabled: true
                }
            });

            callback();
            return;
        }
        else {
            callback();
            return;
        }
    });
}

/**
 * Function for opening level in editor.
 * Data are sent to the renderer processes. 
 * There they are processed and displayed in the right format.
 */
function setUpProject(window, obj) {
    const { type, appPath, path, projectData, spriteSheetPath } = obj;

    get('editorData', (err, editorData) => {
        if(err) throw err;

        window.webContents.send('setUpProject', { 
            type, 
            appPath,
            editorData,
            path,
            spriteSheetPath,
            data: projectData 
        });
    });
}

function openSpriteSheetDialog(window, spriteSheetName) {
    return dialog.showOpenDialog(window, {
        title: `What's the path have the sprite sheet "${spriteSheetName}"?`,
        filters: [
            {
                name: '.JSON file',
                extensions: ['json']
            }
        ]
    });
}