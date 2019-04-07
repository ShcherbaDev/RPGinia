/**
 * The purpose of these two functions is returning 
 * the original sizes of the sprite from their sprite sheets.
 * 
 * If sprite contains frames - return original sizes 
 * of this frame from sprite sheet.
 */

export function setOriginalWidth(spriteSheetIndex, spriteIndex, frameIndex, spriteSheets) {
    const spriteInSpriteSheet = spriteSheets[spriteSheetIndex].sprites[spriteIndex];
    
    if(spriteInSpriteSheet.rect) {
        return spriteInSpriteSheet.rect[2];
    }

    else {
        return spriteInSpriteSheet.frames[frameIndex].rect[2];
    }
}

export function setOriginalHeight(spriteSheetIndex, spriteIndex, frameIndex, spriteSheets) {
    const spriteInSpriteSheet = spriteSheets[spriteSheetIndex].sprites[spriteIndex];
    
    if(spriteInSpriteSheet.rect) {
        return spriteInSpriteSheet.rect[3];
    }

    else {
        return spriteInSpriteSheet.frames[frameIndex].rect[3];
    }
}