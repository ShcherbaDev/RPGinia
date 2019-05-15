<template>     
    <div class="object_settings">
        <h1>{{ object.settings.name }}</h1>
        <CustomInput
            type="text"
            id="objectName"
            label="Name:"
            :value="object.settings.name"
            @input="setObjectProperty({ id: object.$id, property: 'name', newPropertyValue: $event })" 
        />

        <CustomInput
            type="number"
            id="objectLayer"
            label="Layer:"
            :value="object.settings.layer"
            @input="setLayer" 
        />

        <h2>Coordinations:</h2>
        <CustomInput
            type="number"
            id="objectX"
            label="X:"
            :value="object.settings.coords[0]"
            @input="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '0', newPropertyValue: $event })" 
        />

        <CustomInput
            type="number"
            id="objectY"
            label="Y:"
            :value="object.settings.coords[1]"
            @input="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '1', newPropertyValue: $event })" 
        />
        
        <CustomInput
            type="number"
            id="objectWidth"
            label="Width:"
            :value="object.settings.coords[2]"
            @input="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '2', newPropertyValue: $event })" 
        />
        <button 
            class="btn" 
            style="margin-top: 10px;" 
            @click="setOriginalSizes('width')"
        >
            Set to original sprite width
        </button>
        
        <CustomInput
            type="number"
            id="objectHeight"
            label="Height:"
            :value="object.settings.coords[3]"
            @input="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '3', newPropertyValue: $event })" 
        />
        <button 
            class="btn" 
            style="margin-top: 10px;" 
            @click="setOriginalSizes('height')"
        >
            Set to original sprite height
        </button>

        <h2>Other settings:</h2>

        <h3>Select sprite:</h3>
        <SpriteInfo :object="object.settings" />

        <CustomInput 
            type="checkbox"
            id="objectVisibility"
            label="Is visible:"
            :is-checked="object.settings.isVisible"
            @change="setObjectProperty({ id: object.$id, property: 'isVisible', newPropertyValue: $event })"
        />

        <button 
            class="btn" 
            @click="openRepeatModal"
        >Repeat</button>

        <h2 v-if="projectSpriteSheets.data[object.settings.settings.spriteSheetIndex].sprites[object.settings.settings.spriteIndex].frames">Animation settings:</h2>
        <div 
            class="animation_settings"
            v-if="projectSpriteSheets.data[object.settings.settings.spriteSheetIndex].sprites[object.settings.settings.spriteIndex].frames"
            style="margin-top: 10px"
        >
            <CustomInput
                type="number"
                id="objectAnimationFrameFrom"
                label="Start frame:"
                :num-min="0"
                :num-max="object.settings.settings.frameTo-1"
                :value="object.settings.settings.frameFrom"
                @input="setObjectProperty({ id: object.$id, property: 'settings', propertySetting: 'frameFrom', newPropertyValue: $event })" 
            />

            <CustomInput
                type="number"
                id="objectAnimationFrameTo"
                label="Final frame:"
                :num-min="object.settings.settings.frameFrom"
                :num-max="projectSpriteSheets.data[object.settings.settings.spriteSheetIndex].sprites[object.settings.settings.spriteIndex].frames.length-1"
                :value="object.settings.settings.frameTo"
                @input="setObjectProperty({ id: object.$id, property: 'settings', propertySetting: 'frameTo', newPropertyValue: $event })" 
            />

            <CustomInput
                type="number"
                id="objectAnimationInterval"
                label="Interval:"
                :num-min="10"
                :value="object.settings.settings.interval"
                @input="setAnimationInterval" 
            />
        
            <CustomInput 
                type="checkbox"
                id="objectAnimationRepeating"
                label="Is animation repeating:"
                :is-checked="object.settings.settings.isRepeating"
                @change="setObjectProperty({ id: object.$id, property: 'settings', propertySetting: 'isRepeating', newPropertyValue: $event })" 
            />

            <CustomInput 
                type="checkbox"
                id="objectAnimationPlaying"
                label="Is animation playing:"
                :is-checked="object.settings.settings.isPlaying"
                @change="setObjectProperty({ id: object.$id, property: 'settings', propertySetting: 'isPlaying', newPropertyValue: $event })" 
            />
        </div>
    </div>
</template>
<script>
import CustomInputs from '../../CustomInputs';
import SpriteInfo from '../SpriteInfo';

import convertColorNameToHex from '../../../assets/js/convertColorNameToHex';
import * as originalSpriteSizes from '../../../assets/js/setOriginalSpriteSizes';
import { ipcRenderer } from 'electron';

import '../../../store/index.js';
import { mapGetters, mapActions } from 'vuex';
import { setInterval } from 'timers';

export default {
    components: { SpriteInfo, CustomInput: CustomInputs },
    computed: mapGetters(['projectObjects', 'selectedObjects', 'projectSpriteSheets']),
    methods: {
        ...mapActions(['setObjectProperty']),

        parseToHex(color) { 
            return convertColorNameToHex(color);
        },

        setLayer(e) {
            this.setObjectProperty({ id: this.object.$id, property: 'layer', newPropertyValue: e });
            ipcRenderer.send('sortObjectsByLayersRequest');
        },

        openRepeatModal() {
            ipcRenderer.send('requestModalOpen', 'repeatObject', this.object.$id);
        },

        setOriginalSizes(type) {
            const { setObjectProperty, projectSpriteSheets, object } = this;

            const spriteSettings = object.settings.settings;
            const { spriteSheetIndex, spriteIndex, frameIndex, frames } = spriteSettings;
            const currentSprite = projectSpriteSheets.data[spriteSheetIndex].sprites[spriteIndex]; 

            let originalSizes = null;

            if (type === 'width') {
                originalSizes = originalSpriteSizes.setOriginalWidth(
                    spriteSheetIndex, spriteIndex, frameIndex,
                    projectSpriteSheets
                );
                document.querySelector('input#objectWidth').value = originalSizes;
            }
            else if (type === 'height') {
                originalSizes = originalSpriteSizes.setOriginalHeight(
                    spriteSheetIndex, spriteIndex, frameIndex,
                    projectSpriteSheets
                );
                document.querySelector('input#objectHeight').value = originalSizes;
            }
            else {
                console.error('Can\'t find original sizes!');
            }

            setObjectProperty({ id: object.$id, property: 'coords', propertySetting: type === 'width' ? '2' : '3', newPropertyValue: originalSizes });
        },

        setAnimationInterval(e) {
            this.setObjectProperty({ id: this.object.$id, property: 'settings', propertySetting: 'interval', newPropertyValue: e });

            clearInterval(this.object.settings.settings.spriteAnimation);
            this.object.settings.settings.spriteAnimation = null;
            delete this.object.settings.settings.spriteAnimation;
            this.object._setUpAnimationInterval();
        }
    },
    props: {
        object: Object
    }
}
</script>
