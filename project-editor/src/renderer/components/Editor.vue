<template>
    <div class="editor">
        <div class="block properties">
            <Block 
                className="object_list" 
                title="Object list" 
                titleAddButton 
                titleDeleteButton 
                @add="openCreateObjectModal"
                @delete="deleteObject">
                <ul v-if="projectObjects.length > 0">
                    <ObjectListItem v-for="obj in projectObjects" 
                                    :key="obj.$id"
                                    :name="obj.settings.name" 
                                    :type="obj.settings.type"
                                    :id="obj.$id" />
                </ul>

                <p class="error_text" v-else>
                    Object list<br/>is empty!
                </p>
            </Block>
            <Block className="object" title="Object properties">
                <p class="error_text" v-if="selectedObjects.length === 0">No one object<br/>wasn't selected</p>
                <ObjectProperties v-for="objId in selectedObjects"
                                  :key="objId"
                                  :object="projectObjects[projectObjects.findIndex(item => item.$id === objId)]"
                                  v-else />
            </Block>
        </div>

        <Block className="playground" title="Playground">
            <Playground />
        </Block>
    </div>
</template>
<script>
import Block from './EditorComponents/Blocks/Block';
import ObjectListItem from './EditorComponents/ObjectListItem';
import ObjectProperties from './EditorComponents/ObjectProperties';
import Playground from './EditorComponents/Playground';

import '../store/index.js';
import { mapGetters, mapActions } from 'vuex';

import { ipcRenderer } from 'electron';

import initPlayground from '../assets/js/playgroundCanvas';
import selectObjects from '../assets/js/selectObjects';
import initClipboardActions from '../assets/js/clipboard';

export default {
    name: 'editor',
    components: {
        Block, ObjectListItem, ObjectProperties, Playground
    },
    methods: {
        ...mapActions(['clearSelectedObjects']),
        ...mapActions('EditorData', ['setUpEditorData']),

        openCreateObjectModal() {
            ipcRenderer.send('requestModalOpen', 'createObject');
        },

        deleteObject() {
            for(let selectedObjectId of this.selectedObjects) {
                this.$store.dispatch('deleteObject', this.projectObjects.findIndex(item => item.$id === selectedObjectId));
            }
        }
    },
    computed: {
        ...mapGetters(['projectSettings', 'projectObjects', 'selectedObjects']),

        getProjectData() {
            if(this.$store.getters.projectType === 'level') {
                return {
                    settings: this.$store.getters.projectSettings,
                    elements: this.$store.getters.projectObjects
                };
            }
        }
    },
    
    created() {
        // Actions on setting up 
        ipcRenderer.on('setUpProject', (e, data) => {
            // If the click was not on the list of objects - deselect all objects
            document.querySelector('.block.object_list > .content').addEventListener('click', e => {
                if(this.selectedObjects.length > 0 && e.path.findIndex(item => item.tagName === 'UL') === -1) {
                    this.clearSelectedObjects();
                }
            });

            // Initializing app data
            this.setUpEditorData(data.editorData);

            // Initialize playground - connecting engine, initializing project store and drawing objects
            initPlayground(data, this.$store);
        });

        // Get project data
        ipcRenderer.on('getProjectData', e => {
            e.sender.send('getProjectDataResponse', {
                projectData: this.getProjectData,
                store: this.$store.getters
            });
        });

        // 'addObject' event is on renderer/assets/playgroundCanvas.js

        // Delete object
        ipcRenderer.on('deleteObject', e => this.deleteObject());

        // Initialize clipboard actions for game objects (supports only one object)
        initClipboardActions(this.$store, document);
    }
}
</script>