import Object from '../Object.js';

class Rectangle extends Object {
    constructor(settings) {
        super(settings);

        if(this._settings.settings.fill === undefined)
            this._settings.settings.fill = '#000000';
    }

    draw() {
        if(this._settings.type === 'rectangle') {
            const rectSettings = this._settings.settings;
            
            this._context.fillStyle = rectSettings.fill;
            this._context.fillRect(
                this._settings.coords[0] + this._camera.x, 
                this._settings.coords[1] + this._camera.y,
                this._settings.coords[2], this._settings.coords[3],  
            );
        }
    }

    drawInDebug() { 
        this._settings.borderCoords = [
            this._settings.coords[0] + this._camera.x,
            this._settings.coords[1] + this._camera.y
        ];

        super.drawInDebug();
    }
}

export default Rectangle;