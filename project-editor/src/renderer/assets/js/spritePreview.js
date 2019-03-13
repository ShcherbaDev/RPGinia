let componentData;
let storeGetters;
let previewContainer;

let cnv;
let ctx;
let sprite;
let draw;
let currentSprite;
let spriteSheetCoords; 

export default function initPreviewCanvas(comp) { 
    componentData = comp.$parent;
    storeGetters = comp.$store.getters;

    // Initializing variables
    previewContainer = document.querySelector('.sprite_preview');

    cnv = document.querySelector('canvas#preview');
    ctx = cnv.getContext('2d');

    // Creating image
    sprite = new Image();

    // Drawing
    draw = () => {
        sprite.src = `${storeGetters.projectAppPath}/${storeGetters.projectSpriteSheets[componentData.spriteSheetIndex].file}`;

        currentSprite = storeGetters.projectSpriteSheets[componentData.spriteSheetIndex].sprites[componentData.spriteIndex];

        spriteSheetCoords = 
            currentSprite.rect ? currentSprite.rect : currentSprite.frames[componentData.frameIndex].rect

        cnv.width = componentData.coords[2];
        cnv.height = componentData.coords[3];

        // Draw background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, cnv.width, cnv.height);

        // Draw sprite
        ctx.drawImage(
            sprite,

            spriteSheetCoords[0], spriteSheetCoords[1],
            spriteSheetCoords[2], spriteSheetCoords[3],

            0, 0,
            cnv.width, cnv.height
        );
        
        requestAnimationFrame(draw);
    };
    draw();
}
