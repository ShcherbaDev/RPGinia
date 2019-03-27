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

        <!-- Sprite sheet settings -->
        <CustomInput 
            type="checkbox"
            id="includeSpriteSheetCheckbox"
            label="Include sprite sheet:"
            :isChecked="includeSpriteSheet"
            @change="setSpriteSheetPathEnabled" />

        <CustomInput
            type="file"
            chooseFileTitle="Select an existing sprite sheet"
            fileMethod="open"
            id="spriteSheetPath"
            label="Path to sprite sheet:"
            v-model="projSpriteSheetPath"
            v-if="includeSpriteSheet" />

        <!-- Controller settings -->
        <CustomInput
            type="checkbox"
            id="includeControllerCheckbox"
            label="Include level controller:"
            :isChecked="includeController"
            @change="setControllerPathEnabled" />

        <CustomInput
            type="file"
            chooseFileTitle="Select a level controller"
            fileMethod="open"
            id="controllerPath"
            label="Path to level controller:"
            fileExtension="js"
            fileExtensionLabel="JS file"
            v-model="projControllerPath"
            v-if="includeController" />
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
            projSpriteSheetPath: '',

            includeController: false,
            projControllerPath: ''
        }
    },

    components: { CustomInput: CustomInputs },
    computed: mapGetters(['projectSettings', 'projectAppPath']),
    methods: {
        setSpriteSheetPathEnabled(isTurnedOn) {
            this.includeSpriteSheet = isTurnedOn;

            if(!isTurnedOn) {
                this.projSpriteSheetPath = '';
            }
        },

        setControllerPathEnabled(isTurnedOn) {
            this.includeController = isTurnedOn;

            if(!isTurnedOn) {
                this.projControllerPath = '';
            }
        }
    },
    mounted() {
        this.projName = this.projectSettings.name;
        this.projBackground = this.projectSettings.background;
        this.projAppPath = this.projectAppPath;

        this.includeSpriteSheet = this.projectSettings.spriteSheetPath !== undefined;
        this.projSpriteSheetPath = this.projectSettings.spriteSheetPath || '';

        this.includeController = this.projectSettings.controllerPath !== undefined;
        this.projControllerPath = this.projectSettings.controllerPath || '';
    }
}
</script>
