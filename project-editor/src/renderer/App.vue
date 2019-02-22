<template>
  <div id="app">
    <router-view></router-view>

    <Modal :title="modalInfo.title" v-if="modalInfo.isOpened" @close="modalInfo.isOpened = false">
    	<NewProjectModalContent v-if="modalInfo.type === 'createProject'" @createProject="createProject"></NewProjectModalContent>
		
		<div v-else>...</div>
    </Modal>
  </div>
</template>

<script>
import Modal from './components/Modal';
import NewProjectModalContent from './components/Modals/NewProject';

import { ipcRenderer } from 'electron';

export default {
	name: "project-editor",
	components: { Modal, NewProjectModalContent },
	data: function() {
		return {
			modalInfo: {
				title: '',
				type: '',
				isOpened: false
			}
		}
	},
	methods: {
		createProject: function(arg) {
			ipcRenderer.send('closeModal', arg);
			this.setDataToDefault();
		},

		setDataToDefault: function() {
			this.modalInfo.type = '';
			this.modalInfo.title = '';
			this.modalInfo.isOpened = false;
		}
	},
	created: function() {
		ipcRenderer.on('openModal', (e, type) => {
			if(type === 'createProject') {
				this.modalInfo.type = 'createProject';
				this.modalInfo.title = 'Create new project';
				this.modalInfo.isOpened = true;
			}
		});
	}
};
</script>

<style src="./assets/css/main.css"></style>
<style src="./assets/css/fonts.css"></style>
<style src="./assets/css/themes/dark.css"></style>
<style src="./assets/css/scrollbar.css"></style>
