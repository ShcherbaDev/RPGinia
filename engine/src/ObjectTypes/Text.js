import Object from '../Object.js';

class Text extends Object {
    constructor(settings) {
        super(settings);
    }

    draw() {
        if(this._settings.type === 'text') {
            const textSettings = this._settings.settings;

            this._context.fillStyle = textSettings.color;
            this._context.font = `${textSettings.size}px "${textSettings.font}"`;
            
            this._context.textAlign = 'left';
            this._context.textBaseline = 'top';

            this._context.fillText(textSettings.text, this._settings.coords[0]+this._camera.x, this._settings.coords[1]+this._camera.y)
        }
    }

    drawInDebug() {
        super.drawInDebug();
    }
}

export default Text;