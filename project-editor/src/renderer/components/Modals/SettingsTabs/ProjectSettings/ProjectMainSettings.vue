<template>
    <div>
        <h1>Project main settings</h1>

        <CustomInput
            type="text"
            id="projectName"
            label="Name:"
            v-model="projName" />

        <CustomInput 
            type="file"
            chooseFileTitle="Choose a path to your RPGinia app"
            fileMethod="open"
            :isOpenDirectory="true"
            id="projectAppPath"
            label="RPGinia app path:"
            v-model="projAppPath" />

        <CustomInput 
            type="color"
            id="projectBackground"
            label="Background color:"
            :value="projBackground"
            @change="projBackground = $event" />


        <CustomInput 
            type="checkbox"
            id="includeSpriteSheetCheckbox"
            label="Include sprite sheet:"
            :isChecked="includeSpriteSheet"
            @change="includeSpriteSheet = $event" />

        <CustomInput
            type="file"
            chooseFileTitle="Select an existing sprite sheet"
            fileMethod="open"
            id="spriteSheetPath"
            label="Path to sprite sheet:"
            v-model="projSpriteSheetPath"
            v-if="includeSpriteSheet" />
    </div>
</template>
<script>
import CustomInputs from '../../../CustomInputs';

import '../../../../store/index.js';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            projName: '',
            projBackground: '',
            projAppPath: '',
            includeSpriteSheet: false,
            projSpriteSheetPath: ''
        }
    },

    components: { CustomInput: CustomInputs },
    computed: mapGetters(['projectSettings', 'projectAppPath']),
    mounted() {
        this.projName = this.projectSettings.name;
        this.projBackground = this.projectSettings.background;
        this.projAppPath = this.projectAppPath;

        this.includeSpriteSheet = this.projectSettings.spriteSheetPath !== undefined;
        this.projSpriteSheetPath = this.projectSettings.spriteSheetPath || '';
    }
}
</script>
