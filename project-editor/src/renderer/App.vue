<template>
  <div id="app">
    <router-view></router-view>

    <Modal :title="modalInfo.title" v-if="modalInfo.isOpened" @close="setDataToDefault">
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

		<Documentation
			v-else-if="modalInfo.type === 'documentation'" />

		<BrowseSprites
			v-else-if="modalInfo.type === 'browseSprites'"
			:spriteId="modalInfo.arg.$id"
			@setNewSprite="setNewSprite" />

		<div class="modal_content" v-else>
			<div class="modal_body">
				<p class="error_text">Content for this modal window is not exist!</p>
			</div>
		</div>
    </Modal>
  </div>
</template>

<script>
import Modal from './components/Modal';
import NewProject from './components/Modals/NewProject';
import NewObject from './components/Modals/NewObject';
import Settings from './components/Modals/Settings';
import RepeatObject from './components/Modals/RepeatObject';
import Documentation from './components/Modals/Documentation';
import BrowseSprites from './components/Modals/BrowseSprites';

import { ipcRenderer } from 'electron';

export default {
	name: 'project-editor',
	components: { Modal, NewProject, NewObject, Settings, RepeatObject, Documentation, BrowseSprites },
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

		setNewSprite: function(arg) {
			ipcRenderer.send('setNewSpriteRequest', arg);
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
				this.modalInfo.type = type;
				this.modalInfo.title = 'Create new project';
			}

			if(type === 'createObject') {
				this.modalInfo.type = type;
				this.modalInfo.title = 'Create new object';
			}

			if(type === 'settings') {
				this.modalInfo.type = type;
				this.modalInfo.title = 'Settings';
			}

			if(type === 'repeatObject') {
				this.modalInfo.type = type;
				this.modalInfo.title = 'Repeat object';
				this.modalInfo.arg = arg;
			}

			if(type === 'documentation') {
				this.modalInfo.type = type;
				this.modalInfo.title = 'RPGinia project editor documentation';
			}

			if(type === 'browseSprites') {
				this.modalInfo.type = type;
				this.modalInfo.title = 'Browse sprites';
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
