<template>
    <div class="browse_sprite">
        <div class="sprite_name">
            <p>{{ getOriginalName() }}</p>
        </div>
        <div class="sprite_preview">
            <div class="sprite_image_container">
                <div 
                    class="sprite_image"
                    :style="spriteStyles()"
                ></div>
            </div>
        </div>
        <div class="sprite_select_buttons">
            <div class="sizes">
                <h3>Original sprite sizes:</h3>
                <p>{{ getOriginalCoords()[2] }}x{{ getOriginalCoords()[3] }}</p>
            </div>

            <button class="btn" @click="browseSprites">Browse</button>
        </div>
    </div>
</template>
<script>
import { ipcRenderer } from 'electron';

import '../../store/index.js';
import { mapGetters } from 'vuex';

export default {
    props: {
        object: Object,
    },
    computed: mapGetters(['projectAppPath', 'projectSpriteSheets']),
    methods: {
        spriteStyles() {
            const { projectAppPath, object, projectSpriteSheets } = this;

            const objectIndexes = object.settings;
            const { spriteSheetIndex, spriteIndex, frameIndex } = objectIndexes;
            const spritesInSpriteSheet = projectSpriteSheets.data[spriteSheetIndex].sprites[spriteIndex];
            
            const spriteInSpriteSheetCoords = spritesInSpriteSheet.rect || spritesInSpriteSheet.frames[0].rect;

            return {
                backgroundImage: `url("file://${projectAppPath.replace(/\\/g, '/')}/${projectSpriteSheets.data[spriteSheetIndex].file}")`,
                backgroundPosition: `-${spriteInSpriteSheetCoords[0]}px -${spriteInSpriteSheetCoords[1]}px`,
                width: `${spriteInSpriteSheetCoords[2]}px`,
                height: `${spriteInSpriteSheetCoords[3]}px`
            }
        },

        getOriginalCoords() {
            const { object, projectSpriteSheets } = this;

            const objectIndexes = object.settings;
            const { spriteSheetIndex, spriteIndex, frameIndex } = objectIndexes;
            const spritesInSpriteSheet = projectSpriteSheets.data[spriteSheetIndex].sprites[spriteIndex];

            return spritesInSpriteSheet.rect || spritesInSpriteSheet.frames[0].rect;
        },

        getOriginalName() {
            const { object, projectSpriteSheets } = this;

            const objectIndexes = object.settings;
            const { spriteSheetIndex, spriteIndex } = objectIndexes;
            return projectSpriteSheets.data[spriteSheetIndex].sprites[spriteIndex].name;
        },

        browseSprites() {
            ipcRenderer.send('requestModalOpen', 'browseSprites', this.object);
        }
    }
}
</script>

<style>
    .browse_sprite {
        display: grid;
        grid-template-areas: "name name" "preview buttons"; 
        grid-template-rows: 32px 1fr;
        grid-template-columns: 150px 1fr;
        max-width: 404px;
        background-color: #333;
        border: 1px solid #666;
        border-radius: 2px;
        padding: 10px;
        overflow: auto;
    }

    .browse_sprite > .sprite_name {
        grid-area: name;
    }

    .sprite_name > p {
        width: 100%;
        font-size: 22px;
        white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
    }

    .browse_sprite > .sprite_preview {
        grid-area: preview;
    }

    .sprite_preview > .sprite_image_container {
        overflow: auto;
        width: 100%;
        height: 150px;
        background-color: #000;
    }

    .browse_sprite > .sprite_select_buttons {
        grid-area: buttons;
        padding-left: 15px;
    }

    .sprite_select_buttons > div {
        margin-bottom: 10px;
        
    }

    .sprite_select_buttons h3 {
        margin-bottom: 5px;
    }
</style>
