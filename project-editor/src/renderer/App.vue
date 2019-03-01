<template>
  <div id="app">
    <router-view></router-view>

    <Modal :title="modalInfo.title" v-if="modalInfo.isOpened" @close="modalInfo.isOpened = false">
    	<NewProject v-if="modalInfo.type === 'createProject'" @createProject="createProject"></NewProject>
		<NewObject v-else-if="modalInfo.type === 'createObject'" @createObject="createObject"></NewObject>

		<div v-else>...</div>
    </Modal>
  </div>
</template>

<script>
import Modal from './components/Modal';
import NewProject from './components/Modals/NewProject';
import NewObject from './components/Modals/NewObject';

import { ipcRenderer } from 'electron';

export default {
	name: "project-editor",
	components: { Modal, NewProject, NewObject },
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

		createObject: function(arg) {
			ipcRenderer.send('closeModal');
			ipcRenderer.send('createObjectRequest', arg);
			this.setDataToDefault();
		},

		setDataToDefault: function() {
			this.modalInfo.type = '';
			this.modalInfo.title = '';
			this.modalInfo.isOpened = false;
		}
	},
	created: function() {
		this.setDataToDefault();
		ipcRenderer.on('openModal', (e, type) => {
			if(type === 'createProject') {
				this.modalInfo.type = 'createProject';
				this.modalInfo.title = 'Create new project';
				this.modalInfo.isOpened = true;
			}

			if(type === 'createObject') {
				this.modalInfo.type = 'createObject';
				this.modalInfo.title = 'Create new object';
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
