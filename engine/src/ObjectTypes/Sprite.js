import Object from '../Object.js';

class Sprite extends Object {
    constructor(settings) {
        super(settings);

        this._spriteSheets = this._world.currentLevel.data.spriteSheets;
        this._init();
    }

    _init() {
        if(!this._settings.coords[2]) {
            if(this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].rect)
                this._settings.coords[2] = this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].rect[2];
            else 
                this._settings.coords[2] = this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].frames[this._settings.settings.frameIndex].rect[2];
        }

        if(!this._settings.coords[3]) {
            if(this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].rect)
                this._settings.coords[3] = this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].rect[3];
            else 
                this._settings.coords[3] = this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].frames[this._settings.settings.frameIndex].rect[3];
        }

        this._settings.image = new Image();
        this._settings.isLoaded = false;
        
        this._settings.image.onload = () => this._settings.isLoaded = true;
        this._settings.image.src = this._appPath + this._spriteSheets[this._settings.settings.spriteSheetIndex].file;	
    
        this._setUpSettingsForAnimatedSprite();
    }

    _setUpAnimationInterval() {
        this._settings.settings.spriteAnimation = setInterval(() => {
            if(this._settings.settings.isPlaying) {
                if(this._settings.settings.frameIndex < this._settings.settings.frameTo)
                    this._settings.settings.frameIndex += 1;
                
                else {
                    if(this._settings.settings.isRepeating)
                        this._settings.settings.frameIndex = this._settings.settings.frameFrom;
                
                    else {
                        this._settings.settings.isPlaying = false;
                        clearInterval(this._settings.settings.spriteAnimation);
                        delete this._settings.settings.spriteAnimation;
                    }
                }
            }
            
            else {
                this._settings.settings.isPlaying = false;
                clearInterval(this._settings.settings.spriteAnimation);
                delete this._settings.settings.spriteAnimation;
            }
        }, this._settings.settings.interval);
    }

    _setUpSettingsForAnimatedSprite() {
        if(this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].frames) {
            if(!this._settings.settings.interval) 
                this._settings.settings.interval = 60;

            if(!this._settings.settings.frameFrom)
                this._settings.settings.frameFrom = 0;

            if(!this._settings.settings.frameTo)
                this._settings.settings.frameTo = this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex].frames.length-1;
            
            if(!this._settings.settings.frameIndex)
                this._settings.settings.frameIndex = this._settings.settings.frameFrom;
        
            if(!this._settings.settings.isRepeating)
                this._settings.settings.isRepeating = false;

            this._setUpAnimationInterval();
        }
    }

    draw() {
        if(this._settings.type === 'sprite' && this._settings.isLoaded) {
            const currentSprite = this._spriteSheets[this._settings.settings.spriteSheetIndex].sprites[this._settings.settings.spriteIndex];        
            const spriteSheetCoords = currentSprite.rect ? currentSprite.rect : currentSprite.frames[this._settings.settings.frameIndex].rect;
            const spriteCoords = this._settings.coords;

            if(this._settings.settings.isPlaying && !this._settings.settings.spriteAnimation) {
                this._setUpAnimationInterval();
            }

            this._context.drawImage(
                this._settings.image,

                spriteSheetCoords[0], 
                spriteSheetCoords[1], 
                spriteSheetCoords[2], 
                spriteSheetCoords[3],
                
                spriteCoords[0] + this._camera.x, 
                spriteCoords[1] + this._camera.y, 
                spriteCoords[2] || spriteSheetCoords[2], 
                spriteCoords[3] || spriteSheetCoords[3]
            );
        }
    }

    drawInDebug() {
        super.drawInDebug();
    }
}

export default Sprite;