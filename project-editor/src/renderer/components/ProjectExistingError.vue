<template>
    <div class="project_not_exist_error">
        <div class="central_window">
            <div class="window_title">
                <h1>Project is not exist!</h1>
            </div>
            <div class="description">
                <p>
                    You can 
                    <a href="#" id="createProject" @click="createProject">create new</a> 
                    or 
                    <a href="#" id="openProject" @click="openProject">open</a>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { ipcRenderer } from 'electron';

import Modal from './Modal';
import NewProjectModalContent from './Modals/NewProject';

export default {
    name: 'existing-error',
    components: { Modal, NewProjectModalContent },
    methods: {
        createProject: function() {
            ipcRenderer.send('createProject')
        },

        openProject: function() {
            ipcRenderer.send('openProject');
        }
    }
}
</script>

<style src="../assets/css/projectExistingError.css"></style>