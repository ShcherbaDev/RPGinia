<template>     
    <div class="object_settings">
        <h1>{{ object.settings.name }}</h1>
        <CustomInput
            type="text"
            id="objectName"
            label="Name:"
            :value="object.settings.name"
            @input="setObjectProperty({ id: object.$id, property: 'name', newPropertyValue: $event })" />

        <CustomInput
            type="number"
            id="objectLayer"
            label="Layer:"
            :value="object.settings.layer"
            @input="setLayer" />

        <h2>Coordinations:</h2>
        <CustomInput
            type="number"
            id="objectX"
            label="X:"
            :value="object.settings.coords[0]"
            @input="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '0', newPropertyValue: $event })" />

        <CustomInput
            type="number"
            id="objectY"
            label="Y:"
            :value="object.settings.coords[1]"
            @input="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '1', newPropertyValue: $event })" />
        
        <CustomInput
            type="number"
            id="objectWidth"
            label="Width:"
            :value="object.settings.coords[2]"
            @input="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '2', newPropertyValue: $event })" />
        <button class="btn" style="margin-top: 10px;" @click="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '2', newPropertyValue: setOriginalSizes('width') })">Set to original sprite height</button>
        
        <CustomInput
            type="number"
            id="objectHeight"
            label="Height:"
            :value="object.settings.coords[3]"
            @input="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '3', newPropertyValue: $event })" />
        <button class="btn" style="margin-top: 10px;" @click="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '3', newPropertyValue: setOriginalSizes('height') })">Set to original sprite height</button>

        <h2>Other settings:</h2>


        <!-- <CustomInput
            type="number"
            id="objectSpriteSheetIndex"
            label="Sprite sheet index:"
            v-if="projectSpriteSheets.length > 0"
            :numMin="0"
            :numMax="projectSpriteSheets.length-1"
            :value="object.settings.settings.spriteSheetIndex"
            @input="setObjectProperty({ id: object.$id, property: 'settings', propertySetting: 'spriteSheetIndex', newPropertyValue: $event })" />

        <CustomInput
            type="number"
            id="objectSpriteIndex"
            label="Sprite index:"
            :numMin="0"
            :numMax="projectSpriteSheets[object.settings.settings.spriteSheetIndex].sprites.length-1"
            :value="object.settings.settings.spriteIndex"
            @input="setObjectProperty({ id: object.$id, property: 'settings', propertySetting: 'spriteIndex', newPropertyValue: $event })" /> -->

        <ViewSprite :object="object" />

        <CustomInput
            type="number"
            id="objectFrameIndex"
            label="Frame index:"
            v-if="projectSpriteSheets[object.settings.settings.spriteSheetIndex].sprites[object.settings.settings.spriteIndex].frames"
            :numMin="0"
            :numMax="projectSpriteSheets[object.settings.settings.spriteSheetIndex].sprites[object.settings.settings.spriteIndex].frames.length-1"
            :value="object.settings.settings.frameIndex"
            @input="setObjectProperty({ id: object.$id, property: 'settings', propertySetting: 'frameIndex', newPropertyValue: $event })" />

        <CustomInput 
            type="checkbox"
            id="objectVisibility"
            label="Is visible:"
            :isChecked="object.settings.isVisible"
            @change="setObjectProperty({ id: object.$id, property: 'isVisible', newPropertyValue: $event })" />

        <button class="btn" @click="openRepeatModal">Repeat</button>
    </div>
</template>
<script>
import CustomInputs from '../../CustomInputs';
import ViewSprite from '../ViewSprite';

import convertColorNameToHex from '../../../assets/js/convertColorNameToHex';
import * as originalSpriteSizes from '../../../assets/js/setOriginalSpriteSizes';
import { ipcRenderer } from 'electron';

import '../../../store/index.js';
import { mapGetters, mapActions } from 'vuex';

export default {
    components: { ViewSprite, CustomInput: CustomInputs },
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
            const { projectSpriteSheets, object } = this;

            const spriteSettings = object.settings.settings;
            const { spriteSheetIndex, spriteIndex, frameIndex, frames } = spriteSettings;

            const currentSprite = projectSpriteSheets[spriteSheetIndex].sprites[spriteIndex];

            if(type === 'width') {
                return originalSpriteSizes.setOriginalWidth(
                    spriteSheetIndex, spriteIndex, frameIndex,
                    projectSpriteSheets
                );
            }

            else if(type === 'height') {
                return originalSpriteSizes.setOriginalHeight(
                    spriteSheetIndex, spriteIndex, frameIndex,
                    projectSpriteSheets
                );
            }

            else {
                console.error('Your size type is not exist!');
            }
        }
    },
    props: {
        object: Object
    }
}
</script>
