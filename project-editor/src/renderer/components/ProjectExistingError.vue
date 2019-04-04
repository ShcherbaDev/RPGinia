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
                    <a href="#" id="openProject" @click="openProject">open existing</a>
                    project
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

<style>
    html, body, .project_not_exist_error, .project_not_exist_error > .central_window {
        width: 100%;
        height: 100vh;
    }

    .central_window {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .central_window .window_title > h1 {
        font-size: 48px;
        color: #888;
        margin-bottom: 10px;
    }

    .central_window .description > p {
        font-size: 22px;
        color: #777;
    }
</style>