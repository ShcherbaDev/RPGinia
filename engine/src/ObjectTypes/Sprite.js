import Object from '../Object.js';

class Sprite extends Object {
    constructor(settings, spriteSheets) {
        super(settings);

        this._spriteSheets = spriteSheets;

        this._init();
    }

    _init() {
        if(!this._settings.coords[2]) {
            if(this._spriteSheets[this.spriteSheetIndex].sprites[this.spriteIndex].rect)
                this._settings.coords[2] = this._spriteSheets[this._settings.spriteSheetIndex].sprites[this._settings.spriteIndex].rect[2];
            else 
                this._settings.coords[2] = this._spriteSheets[this._settings.spriteSheetIndex].sprites[this._settings.spriteIndex].frames[this._settings.currentFrame].rect[2];
        }

        if(!this._settings.coords[3]) {
            if(this._spriteSheets[this._settings.spriteSheetIndex].sprites[this._settings.spriteIndex].rect)
                this._settings.coords[3] = this._spriteSheets[this._settings.spriteSheetIndex].sprites[this._settings.spriteIndex].rect[3];
            else 
                this._settings.coords[3] = this._spriteSheets[this._settings.spriteSheetIndex].sprites[this._settings.spriteIndex].frames[this._settings.currentFrame].rect[3];
        }

        this._settings.image = new Image();
        this._settings.isLoaded = false;
        
        this._settings.image.onload = () => this._settings.isLoaded = true;
        this._settings.image.src = this._appPath + this._spriteSheets[this._settings.spriteSheetIndex].file;	
    
        this._setUpSettingsForAnimatedSprite();
    }

    _setUpSettingsForAnimatedSprite() {
        if(this._spriteSheets[this._settings.spriteSheetIndex].sprites[this._settings.spriteIndex].frames) {
            if(!this._settings.frameFrom)
                this._settings.frameFrom = 0;

            if(!this._settings.frameTo)
                this._settings.frameTo = this._spriteSheets[this._settings.spriteSheetIndex].sprites[this._settings.spriteIndex].frames.length-1;
            
            if(!this._settings.currentFrame)
                this._settings.currentFrame = this._settings.frameFrom;
        
            if(!this.isRepeat)
                this.isRepeat = false;

            this._settings.spriteAnimation = setInterval(() => {
                if(this._settings.currentFrame < this._settings.frameTo)
                    this._settings.currentFrame++;
                
                else {
                    if(this._settings.isRepeat)
                        this._settings.currentFrame = this._settings.frameFrom;
                
                    else {
                        clearInterval(this._settings.spriteAnimation);
                        delete this._settings.spriteAnimation;
                    }
                }
            }, this._settings.interval);
        }
    }

    draw() {
        if(this._settings.type === 'sprite' && this._settings.isLoaded) {
            const currentSprite = this._spriteSheets[this._settings.spriteSheetIndex].sprites[this._settings.spriteIndex];
            const spriteSheetCoords = currentSprite.rect ? currentSprite.rect :
                                        currentSprite.frames[this._settings.currentFrame].rect;
            const spriteCoords = this._settings.coords;

            this._context.drawImage(
                this._settings.image,

                spriteSheetCoords[0], 
                spriteSheetCoords[1], 
                spriteSheetCoords[2], 
                spriteSheetCoords[3],
                
                spriteCoords[0], 
                spriteCoords[1], 
                spriteCoords[2] || spriteSheetCoords[2], 
                spriteCoords[3] || spriteSheetCoords[3]
            );
        }
    }

    drawInDebug() {
        this._settings.borderCoords = [
            this._settings.coords[0],
            this._settings.coords[1]
        ];

        super.drawInDebug();
    }

    get settings() { return this._settings }
}

export default Sprite;