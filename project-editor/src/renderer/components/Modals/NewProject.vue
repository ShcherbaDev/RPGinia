<template>
    <div>
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
                chooseFileTitle="Choose a file path:"
                fileMethod="save"
                id="savingDirectory"
                label="Saving directory:"
                v-model="filePath" />

            <CustomInput 
                type="file"
                chooseFileTitle="Choose a path to your RPGinia app"
                fileMethod="open"
                :isOpenDirectory="true"
                id="appDir"
                label="RPGinia app path:"
                v-model="appPath" />

            <!-- Sprite sheet -->
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
                v-model="spriteSheetPath"
                v-if="includeSpriteSheet" />
        </div>
        <div class="modal_footer">
            <button class="btn btn_big btn_green" id="createProject" v-if="projName !== '' && projType !== '' && filePath !== '' && appPath !== ''" @click="validateForm()">Create</button>
            <button class="btn btn_big btn_red" id="createProject" disabled v-else>Form is not valid</button>
        </div>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import CustomInputs from '../CustomInputs';
import CustomFileInput from '../CustomFileInput';

export default {
    components: { CustomInput: CustomInputs, CustomFileInput },
    data: function() {
        return {
            projName: '',
            projType: 'level',
            projectTypes: [
                { id: 1, text: 'Level', value: 'level', disabled: false },
                { id: 2, text: 'Sprite sheet', value: 'spriteSheet', disabled: true },
                { id: 3, text: 'Language', value: 'language', disabled: true }
            ],
            filePath: '',
            appPath: '',
            includeSpriteSheet: false,
            spriteSheetPath: '',
            backgroundColor: '#000000'
        }
    },
    methods: {
        validateForm: function() {
            const name = this.projName;
            const type = this.projType;
            const { backgroundColor, filePath, appPath, spriteSheetPath } = this;

            if(name !== '' && type !== '' && filePath !== '' && appPath !== '') {
                this.$router.push('editor');
                this.$emit('createProject', { name, type, backgroundColor, filePath, appPath, spriteSheetPath });
            }
            else console.error('Form is not valid!');
        }
    }
}
</script>
