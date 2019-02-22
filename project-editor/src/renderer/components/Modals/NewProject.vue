<template>
    <div>
        <div class="modal-body">
            <div class="form_group">
                <label for="projectName">Project name:</label>
                <input type="text" id="projectName" name="projectName" v-model="projName">
            </div>
            <div class="form_group">
                <label for="projectType">Project type:</label>
                <select id="projectType" name="projectType" v-model="projType">
                    <option v-for="type in projectTypes" 
                            :key="type.id"
                            :value="type.value" 
                           :disabled="type.disabled">{{ type.text }}</option>
                </select>
            </div>
            <div class="form_group">
                <label for="savingDirectory_btn">Saving directory:</label>
                <CustomFileInput id="savingDirectory" @fileChoosed="projDir = $event"></CustomFileInput>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn_big btn_green" id="createProject" v-if="projName && projType && projDir" @click="validateForm()">Create</button>
            <button class="btn btn_big btn_red" id="createProject" disabled v-else>Form is not valid</button>
        </div>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import Modal from '../Modal';
import CustomFileInput from '../CustomFileInput';

export default {
    components: { Modal, CustomFileInput },
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
                // ipcRenderer.send('createProject', { name, type, dir });
            }
            else console.error('Form is not valid!');
        }
    }
}
</script>
