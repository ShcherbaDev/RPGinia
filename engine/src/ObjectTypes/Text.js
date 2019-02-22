import Object from '../Object.js';

class Text extends Object {
    constructor(settings) {
        super(settings);

        if(this._settings.settings.horizontalAlign === undefined)
            this._settings.settings.horizontalAlign = 'center';

        if(this._settings.settings.horizontalAlign === 'center') {
            this._settings.borderCoords[0] -= this._settings.coords[2]/2;
            this._settings.centralPointCoords[0] -= this._settings.coords[2]/2;
        }

        if(this._settings.settings.horizontalAlign === 'right') {
            this._settings.borderCoords[0] -= this._settings.coords[2];
            this._settings.centralPointCoords[0] -= this._settings.coords[2];
        }

        this._settings.borderCoords[1] -= this._settings.settings.size/2;
        this._settings.centralPointCoords[1] -= this._settings.settings.size/2;
    }

    draw() {
        if(this._settings.type === 'text') {
            const textSettings = this._settings.settings;

            this._context.fillStyle = textSettings.color;
            this._context.font = `${textSettings.size}px "${textSettings.font}"`;
            
            this._context.textAlign = textSettings.horizontalAlign;
            this._context.textBaseline = 'middle';

            this._context.fillText(textSettings.text, this._settings.coords[0]+this._camera.x, this._settings.coords[1]+this._camera.y)
        }
    }

    drawInDebug() {
        const objectSettings = this._settings.settings;
        
        let borderCoordsX = this._settings.coords[0], 
            borderCoordsY = this._settings.coords[1] - objectSettings.size/2;
                     
        if(objectSettings.horizontalAlign === 'center')
            borderCoordsX -= this._settings.coords[2]/2;

        if(objectSettings.horizontalAlign === 'right') 
            borderCoordsX -= this._settings.coords[2];
    
        this._settings.borderCoords = [
            borderCoordsX + this._camera.x, 
            borderCoordsY + this._camera.y
        ];

        super.drawInDebug();
    }
}

export default Text;