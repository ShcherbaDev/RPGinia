import { ipcRenderer } from 'electron';

export default function initClipboardActions(store, document) {
    const getters = store.getters;

    ipcRenderer.on('copySelectedObjects', e => document.execCommand('copy'));
    ipcRenderer.on('pasteSelectedObjects', e => document.execCommand('paste'));

    document.addEventListener('copy', e => {
        if(getters.selectedObjects.length) {
            e.clipboardData.setData(
                'text/plain', 
                getters.projectObjects[
                    getters.projectObjects.findIndex(item => item.$id === getters.selectedObjects[0])
                ].$id
            );
            e.preventDefault();
        }
    });

    document.addEventListener('paste', e => {
        const id = parseInt(e.clipboardData.getData('text/plain'));
        const clonedObj = 
            JSON.parse(
                JSON.stringify(
                    getters.projectObjects[getters.projectObjects.findIndex(item => item.$id === id)].settings
                )
            );

        clonedObj.coords[0] += clonedObj.coords[2];

        ipcRenderer.send('createObjectRequest', clonedObj);
    });
}
