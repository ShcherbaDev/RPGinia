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