<template>
    <div class="modal_content">
        <div class="modal_body">
            <CustomInput 
                type="text"
                id="projectName"
                label="Project name:"
                v-model="projName" />

            <CustomInput 
                type="select"
                id="projectType"
                label="Project type:"
                v-model="projType"
                :options="projectTypes" />

            <CustomInput 
                type="color"
                id="projectBackground"
                label="Background color:"
                :value="backgroundColor"
                @change="backgroundColor = $event"
                v-if="projType === 'level'" />

            <CustomInput 
                type="file"
                choose-file-title="Choose a path to your RPGinia app"
                file-method="open"
                :is-open-directory="true"
                id="appDir"
                label="RPGinia app path:"
                v-model="appPath" />

            <CustomInput
                type="file"
                choose-file-title="Choose a file path:"
                file-method="save"
                id="savingDirectory"
                label="Saving path:"
                v-model="filePath" />

            <!-- Sprite sheet -->
            <CustomInput 
                type="checkbox"
                id="includeSpriteSheetCheckbox"
                label="Include sprite sheet:"
                :is-checked="includeSpriteSheet"
                @change="setSpriteSheetPathEnabled" />

            <CustomInput
                type="file"
                choose-file-title="Select an existing sprite sheet"
                file-method="open"
                id="spriteSheetPath"
                label="Path to sprite sheet:"
                v-model="spriteSheetPath"
                v-if="includeSpriteSheet" />

            <!-- Controller -->
            <CustomInput
                type="checkbox"
                id="includeControllerCheckbox"
                label="Include level controller:"
                :is-checked="includeController"
                @change="setControllerPathEnabled" />

            <CustomInput
                type="file"
                choose-file-title="Select a level controller"
                file-method="open"
                id="controllerPath"
                label="Path to level controller:"
                file-extension="js"
                file-extension-label="JS file"
                v-model="controllerPath"
                v-if="includeController" />
        </div>
        <div class="modal_footer">
            <button 
                class="btn" 
                v-if="projName && projType && appPath && filePath"
                @click="createProject">Create</button>
            <button class="btn" disabled v-else>Form is not valid</button>
        </div>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import CustomInputs from '../CustomInputs';

export default {
    data() {
        return {
            projName: '',
            projType: 'level',
            projectTypes: [
                { id: 1, text: 'Level', value: 'level', disabled: false }
            ],
            appPath: '',
            filePath: '',
            includeSpriteSheet: false,
            spriteSheetPath: '',
            includeController: false,
            controllerPath: '',
            backgroundColor: '#000000'
        }
    },
    components: { CustomInput: CustomInputs },
    methods: {
        setSpriteSheetPathEnabled(isTurnedOn) {
            this.includeSpriteSheet = isTurnedOn;

            if(!isTurnedOn) {
                this.spriteSheetPath = '';
            }
        },

        setControllerPathEnabled(isTurnedOn) {
            this.includeController = isTurnedOn;

            if(!isTurnedOn) {
                this.controllerPath = '';
            }
        },

        createProject() {
            const name = this.projName;
            const type = this.projType;
            const { backgroundColor, appPath, filePath, spriteSheetPath, controllerPath } = this;

            if(name !== '' && type !== '' && appPath !== '' && filePath !== '') {
                this.$router.push('editor');
                this.$emit('createProject', { name, type, backgroundColor, appPath, filePath, spriteSheetPath, controllerPath });
            }
            else console.error('Form is not valid!');
        }
    }
}
</script>
