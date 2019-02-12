<template>
    <div class="project_not_exist_error">
        <div class="central_window">
            <div class="window_title">
                <h1>Project is not exist!</h1>
            </div>
            <div class="description">
                <p>
                    You can 
                    <a href="#" id="createProject" @click="createModalOpened = true">create new</a> 
                    or 
                    <a href="#" id="openProject">open existing</a>
                </p>
            </div>
        </div>
        <Modal title="Create new project" v-if="createModalOpened" @close="createModalOpened = false">
            <NewProjectModalContent></NewProjectModalContent>
        </Modal>
    </div>
</template>
<script>
import { ipcRenderer } from 'electron';

import Modal from './Modal';
import NewProjectModalContent from './Modals/NewProject';

export default {
    name: 'existing-error',
    components: { Modal, NewProjectModalContent },
    data: function() {
        return {
            createModalOpened: false
        }
    }
}
</script>

<style src="../assets/css/projectExistingError.css"></style>
<style src="../assets/css/main.css"></style>
<style src="../assets/css/fonts.css"></style>
<style src="../assets/css/themes/dark.css"></style>
<style src="../assets/css/scrollbar.css"></style>