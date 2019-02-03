export default class Object {
    constructor(settings) {
        this._appPath = this.__proto__.appPath;
        this._context = this.__proto__.context;

        this._settings = settings;
    
        if(this._settings.type === 'text') {
            this._context.font = `${this._settings.settings.size}px "${this._settings.font}"`;

            if(!this._settings.coords[2])
			    this._settings.coords[2] = this._context.measureText(this._settings.settings.text).width;

            if(!this._settings.coords[3])
                this._settings.coords[3] = this._settings.settings.size;
        }

        if(this._settings.borderCoords === undefined) {
			this._settings.borderCoords = [
				this._settings.coords[0],
				this._settings.coords[1]
            ];
		}

		if(this._settings.centralPointCoords === undefined) {
			this._settings.centralPointCoords = [
				this._settings.coords[2].toFixed(0)/2,
				this._settings.coords[3].toFixed(0)/2
            ];
        }
        
        // Setting up a 'layer' property to default value, if it's not defined.
		if(this._settings.layer === undefined)
        this._settings.layer = 1;

        // Setting up a 'isVisible' property to default value, if it's not defined.
        if(this._settings.isVisible === undefined)
            this._settings.isVisible = true;
    }

    draw() {
        return false;
    }

    drawInDebug() {
        const objectSettings = this._settings;
        
        // Draw borders of elements
        this._context.strokeStyle = 'blue';
        this._context.lineWidth = 3;
        this._context.strokeRect(
            objectSettings.borderCoords[0], objectSettings.borderCoords[1], 
            objectSettings.coords[2], objectSettings.coords[3]);
        this._context.lineWidth = 1;
        this._context.strokeStyle = 'black';

        // Draw central points of elements
        this._context.fillStyle = 'red';
        this._context.fillRect(
            objectSettings.coords[0] + objectSettings.centralPointCoords[0]-10/2, 
            objectSettings.coords[1] + objectSettings.centralPointCoords[1]-10/2, 
            10, 10);
        this._context.fillStyle = 'black';
    }

    get settings() { return this._settings }
}