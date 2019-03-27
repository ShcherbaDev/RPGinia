<template>
  <div id="app">
    <router-view></router-view>

    <Modal :title="modalInfo.title" v-if="modalInfo.isOpened" @close="modalInfo.isOpened = false">
    	<NewProject 
			v-if="modalInfo.type === 'createProject'" 
			@createProject="createProject" />

		<NewObject 
			v-else-if="modalInfo.type === 'createObject'" 
			@createObject="createObject" />

		<Settings 
			v-else-if="modalInfo.type === 'settings'" />

		<RepeatObject 
			v-else-if="modalInfo.type === 'repeatObject'"
			:objectId="modalInfo.arg"
			@repeatObject="repeatObject" />

		<div v-else>...</div>
    </Modal>
  </div>
</template>

<script>
import Modal from './components/Modal';
import NewProject from './components/Modals/NewProject';
import NewObject from './components/Modals/NewObject';
import Settings from './components/Modals/Settings';
import RepeatObject from './components/Modals/RepeatObject';

import { ipcRenderer } from 'electron';

export default {
	name: 'project-editor',
	components: { Modal, NewProject, NewObject, Settings, RepeatObject },
	data: function() {
		return {
			modalInfo: {
				title: '',
				type: '',
				isOpened: false,
				arg: null
			}
		}
	},
	methods: {
		createProject: function(arg) {
			ipcRenderer.send('createProjectRequest', arg);
			this.setDataToDefault();
		},

		createObject: function(arg) {
			ipcRenderer.send('createObjectRequest', arg);
			this.setDataToDefault();
		},

		repeatObject: function(arg) {
			ipcRenderer.send('repeatObjectRequest', arg);
			this.setDataToDefault();
		},

		setDataToDefault: function() {
			this.modalInfo.type = '';
			this.modalInfo.title = '';
			this.modalInfo.isOpened = false;
			this.modalInfo.arg = null;
		}
	},
	created: function() {
		this.setDataToDefault();
		ipcRenderer.on('openModal', (e, type, arg) => {
			if(type === 'createProject') {
				this.modalInfo.type = 'createProject';
				this.modalInfo.title = 'Create new project';
			}

			if(type === 'createObject') {
				this.modalInfo.type = 'createObject';
				this.modalInfo.title = 'Create new object';
			}

			if(type === 'settings') {
				this.modalInfo.type = 'settings';
				this.modalInfo.title = 'Settings';
			}

			if(type === 'repeatObject') {
				this.modalInfo.type = 'repeatObject';
				this.modalInfo.title = 'Repeat object';
				this.modalInfo.arg = arg;
			}

			this.modalInfo.isOpened = true;
		});
	}
};
</script>

<style src="./assets/css/main.css"></style>
<style src="./assets/css/fonts.css"></style>
<style src="./assets/css/themes/dark.css"></style>
<style src="./assets/css/scrollbar.css"></style>
