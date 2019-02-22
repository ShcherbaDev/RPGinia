import { writeFileSync, existsSync, readFile } from 'fs';
import { ipcMain } from 'electron';
import { get, has, set } from 'electron-json-storage';

export function openProject(window) {
    has('projectData', (err, hasKey) => {
        if(err) throw err;
        
        if(hasKey) {
            get('projectData', (error, data) => {
                if(error) throw error;

                if(existsSync(data.path)) {
                    readFile(data.path, 'utf8', (loadFileErr, fileData) => {
                        if(loadFileErr) throw loadFileErr;

                        fileData = JSON.parse(fileData);
                        console.log(`Project has been opened!\nProject name: ${fileData.settings.name}\nProject type: ${data.type}\nProject path: ${data.path}`);
                        window.setTitle(`${fileData.settings.name} - ${window.getTitle()}`);
                        
                        window.webContents.send('setUpProject', { 
                            type: data.type, 
                            data: fileData 
                        });
                    });
                }
                else window.webContents.send('projectNotExist');
            });
        }

        else window.webContents.send('projectNotExist');
    });
}

export function saveProject(window) {
    window.webContents.send('getProjectData');
    ipcMain.on('getProjectDataResponse', (e, obj) => {
        const store = obj.store;

        let projData = Object.assign({}, obj.projectData);

        get('projectData', (error, configData) => {
            if(error) throw error;

            if(configData.type === 'level') {
                for(let i in store.projectObjects) {
                    projData.elements[i] = store.projectObjects[i]._settings;
                }
            }
            writeFileSync(configData.path.replace(/\\/g, '\\\\'), JSON.stringify(projData, null, 4));
        });
    });
}

export function createProject(window) {
    window.webContents.send('openModal', 'createProject');
    ipcMain.on('closeModal', (e, arg) => {
        set('projectData', {
            path: arg.dir.replace(/\\\\/g, '\\'),
            type: arg.type
        });

        let data;
        if(arg.type === 'level') {
            data = `{
        "settings": {
            "name": "${arg.name}",
            "background": "#000000"
        },
        "elements": []
    }`;
            writeFileSync(arg.dir, data);
        }

        window.setTitle(`${arg.name} - ${window.getTitle()}`);

        console.log('Project has been created!\nArguments:', arg);

        // e.sender.send('closeModal');
        e.sender.send('setUpProject', { 
            type: arg.type, 
            data: JSON.parse(data) 
        });
    });
}