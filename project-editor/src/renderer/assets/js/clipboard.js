import { ipcRenderer } from 'electron';

export default function initClipboardActions(store, document) {
    ipcRenderer.on('copySelectedObjects', e => {console.log('asdasd'); document.execCommand('copy')});
    ipcRenderer.on('pasteSelectedObjects', e => document.execCommand('paste'));

    document.addEventListener('copy', e => {
        const getters = store.getters;
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
        const getters = store.getters;
        const id = parseInt(e.clipboardData.getData('text/plain'));
        const obj = Object.assign(getters.projectObjects[getters.projectObjects.findIndex(item => item.$id === id)]);
        obj.settings.coords[0] += 32;
        obj.settings.coords[1] += 32;
        ipcRenderer.send('createObjectRequest', obj.settings);
    });
}
