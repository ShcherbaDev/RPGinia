<template>     
    <div class="object_settings">
        <p>{{ projectSpriteSheets }}</p>
        <h1>{{ object.settings.name }}</h1>
        <CustomInput
            type="text"
            id="objectName"
            label="Name:"
            :value="object.settings.name"
            @input="setObjectProperty({id: object.$id, property: 'name', newPropertyValue: $event})" />

        <h2>Coordinations:</h2>
        <CustomInput
            type="number"
            id="objectX"
            label="X:"
            :value="object.settings.coords[0]"
            @input="setObjectProperty({id: object.$id, property: 'coords', propertySetting: '0', newPropertyValue: $event})" />

        <CustomInput
            type="number"
            id="objectY"
            label="Y:"
            :value="object.settings.coords[1]"
            @input="setObjectProperty({id: object.$id, property: 'coords', propertySetting: '1', newPropertyValue: $event})" />
        
        <CustomInput
            type="number"
            id="objectWidth"
            label="Width:"
            :value="object.settings.coords[2]"
            @input="setObjectProperty({id: object.$id, property: 'coords', propertySetting: '2', newPropertyValue: $event})" />
        
        <CustomInput
            type="number"
            id="objectHeight"
            label="Height:"
            :value="object.settings.coords[3]"
            @input="setObjectProperty({id: object.$id, property: 'coords', propertySetting: '3', newPropertyValue: $event})" />

        <h2>Other settings:</h2>
        <CustomInput 
            type="checkbox"
            id="objectVisibility"
            label="Is visible:"
            :isChecked="object.settings.isVisible"
            @change="setObjectProperty({id: object.$id, property: 'isVisible', newPropertyValue: $event})" />

        <CustomInput
            type="number"
            id="objectSpriteSheetIndex"
            label="Sprite sheet index:"
            v-if="projectSpriteSheets.length > 0"
            :numMin="0"
            :numMax="projectSpriteSheets.length-1"
            :value="object.settings.settings.spriteSheetIndex"
            @input="setObjectProperty({id: object.$id, property: 'settings', propertySetting: 'spriteSheetIndex', newPropertyValue: $event})" />

        <CustomInput
            type="number"
            id="objectSpriteIndex"
            label="Sprite index:"
            :numMin="0"
            :numMax="projectSpriteSheets[object.settings.settings.spriteSheetIndex].sprites.length-1"
            :value="object.settings.settings.spriteIndex"
            @input="setObjectProperty({id: object.$id, property: 'settings', propertySetting: 'spriteIndex', newPropertyValue: $event})" />

        <CustomInput
            type="number"
            id="objectFrameIndex"
            label="Frame index:"
            v-if="projectSpriteSheets[object.settings.settings.spriteSheetIndex].sprites[object.settings.settings.spriteIndex].frames"
            :numMin="0"
            :numMax="projectSpriteSheets[object.settings.settings.spriteSheetIndex].sprites[object.settings.settings.spriteIndex].frames.length-1"
            :value="object.settings.settings.frameIndex"
            @input="setObjectProperty({id: object.$id, property: 'settings', propertySetting: 'frameIndex', newPropertyValue: $event})" />
    </div>
</template>
<script>
import CustomInputs from '../../CustomInputs';
import convertColorNameToHex from '../../../assets/js/convertColorNameToHex';

import '../../../store/index.js';
import { mapGetters, mapActions } from 'vuex';

export default {
    components: { CustomInput: CustomInputs },
    computed: mapGetters(['projectObjects', 'selectedObjects', 'projectSpriteSheets']),
    methods: {
        ...mapActions(['setObjectProperty']),

        parseToHex: function(color) { 
            return convertColorNameToHex(color);
        }
    },
    props: {
        object: Object
    }
}
</script>
