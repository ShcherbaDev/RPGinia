<template>
    <div class="browse_sprite">
        <div class="sprite_name">
            <p>{{ object.settings.name }}</p>
        </div>
        <div class="sprite_preview">
            <div class="sprite_image_container">
                <div 
                    class="sprite_image"
                    :style="spriteStyles()"></div>
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

            const objectIndexes = object.settings.settings;
            const { spriteSheetIndex, spriteIndex, frameIndex } = objectIndexes;
            
            const spriteInSpriteSheetCoords = 
                projectSpriteSheets[spriteSheetIndex].sprites[spriteIndex].rect 
                ? projectSpriteSheets[spriteSheetIndex].sprites[spriteIndex].rect
                : projectSpriteSheets[spriteSheetIndex].sprites[spriteIndex].frames[0].rect;

            return {
                backgroundImage: `url("file://${projectAppPath.replace(/\\/g, '/')}/${projectSpriteSheets[spriteSheetIndex].file}")`,
                backgroundPosition: `-${spriteInSpriteSheetCoords[0]}px -${spriteInSpriteSheetCoords[1]}px`,
                width: `${spriteInSpriteSheetCoords[2]}px`,
                height: `${spriteInSpriteSheetCoords[3]}px`
            }
        },

        getOriginalCoords() {
            const { object, projectSpriteSheets } = this;

            const objectIndexes = object.settings.settings;
            const { spriteSheetIndex, spriteIndex, frameIndex } = objectIndexes;

            return projectSpriteSheets[spriteSheetIndex].sprites[spriteIndex].rect 
                ? projectSpriteSheets[spriteSheetIndex].sprites[spriteIndex].rect
                : projectSpriteSheets[spriteSheetIndex].sprites[spriteIndex].frames[0].rect
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
        grid-template-rows: 50px 1fr;
        grid-template-columns: 150px 1fr;
        max-width: 400px;
        background-color: green;
    }

    .browse_sprite > .sprite_name {
        grid-area: name;
    }

    .browse_sprite > .sprite_preview {
        grid-area: preview;
    }

    .sprite_preview > .sprite_image_container {
        overflow: auto;
        width: 100%;
        height: 150px;
    }

    .browse_sprite > .sprite_select_buttons {
        grid-area: buttons;
    }
</style>
