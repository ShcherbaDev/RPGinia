export function copy(window) {
    window.webContents.send('copySelectedObjects');
}

export function paste(window) {
    window.webContents.send('pasteSelectedObjects');
}