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
                type="file"
                id="savingDirectory"
                label="Saving directory:"
                v-model="projDir" />
        </div>
        <div class="modal_footer">
            <button class="btn btn_big btn_green" id="createProject" v-if="projName && projType && projDir" @click="validateForm()">Create</button>
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
            projDir: '',
            projectTypes: [
                { id: 1, text: 'Level', value: 'level', disabled: false },
                { id: 2, text: 'Sprite sheet', value: 'spriteSheet', disabled: true },
                { id: 3, text: 'Language', value: 'language', disabled: true }
            ]
        }
    },
    methods: {
        validateForm: function() {
            const name = this.projName;
            const type = this.projType;
            const dir = this.projDir;

            if(name && type && dir) {
                this.$router.push('editor');
                this.$emit('createProject', { name, type, dir });
            }
            else console.error('Form is not valid!');
        }
    }
}
</script>
