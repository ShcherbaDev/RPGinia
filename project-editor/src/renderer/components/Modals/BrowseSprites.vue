<template>
    <div class="modal_content">
        <div class="modal_body">
            <SelectSprite
                :sprite-sheets="projectSpriteSheets"
                :style="{ width: '100%' }"
                @select="setNewValues" 
            />
        </div>
        <div class="modal_footer">
            <button 
                class="btn" 
                @click="selectSprite"
            >Select</button>
        </div>
    </div>
</template>
<script>
import SelectSprite from '../EditorComponents/SelectSprite';

import * as originalSpriteSizes from '../../assets/js/setOriginalSpriteSizes';

import '../../store/index.js';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            spriteSheetIndex: 0,
            spriteIndex: 0
        }
    },
    props: { 
        spriteId: Number
    },
    components: { SelectSprite },
    computed: mapGetters(['projectSpriteSheets']),
    methods: {
        setNewValues(event) {
            const { spriteSheetIndex, spriteIndex } = event;

            this.spriteSheetIndex = spriteSheetIndex;
            this.spriteIndex = spriteIndex;
        },

        selectSprite() {
            const { spriteId, spriteSheetIndex, spriteIndex } = this;

            this.$emit('setNewSprite', { spriteId, spriteSheetIndex, spriteIndex });
        }
    }
}
</script>
