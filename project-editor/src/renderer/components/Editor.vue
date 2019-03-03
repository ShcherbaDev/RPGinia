<template>
    <div class="editor">
        <div class="block properties">
            <Block 
                className="object_list" 
                title="Object list" 
                titleAddButton titleDeleteButton 
                @add="createObject"
                @delete="deleteObject"
            >
                <p class="error_text" v-if="!projectObjects.length">
                    Object list is empty!
                </p>

                <ul v-else>
                    <ObjectListItem v-for="obj in projectObjects" 
                                    :key="obj.$id"
                                    :name="obj.settings.name" 
                                    :type="obj.settings.type"
                                    :id="obj.$id" />
                </ul>
            </Block>
            <Block className="object" title="Object properties">
                <p class="error_text" v-if="!selectedObjects.length">Object not selected.</p>
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

import { mapGetters, mapActions } from 'vuex';

import '../store/index.js';

import { ipcRenderer } from 'electron';

import initPlayground from '../assets/js/canvas';

export default {
    name: 'editor',
    components: {
        Block, ObjectListItem, ObjectProperties, Playground
    },
    methods: {
        ...mapActions(['addObject', 'clearProjectStore', 'setUpProjectStore']),

        createObject: function() {
            ipcRenderer.send('requestModalOpen', 'createObject');
        },

        deleteObject: function() {
            for(let selectedObjectId of this.selectedObjects) {
                ipcRenderer.send('requestDeleteObject', this.projectObjects.findIndex(item => item.$id === selectedObjectId))
            }
        }
    },
    computed: {
        ...mapGetters(['projectSettings', 'projectObjects', 'selectedObjects']),

        projectData: function() {
            if(this.$store.getters.projectType === 'level') {
                return {
                    settings: this.$store.getters.projectSettings,
                    elements: this.$store.getters.projectObjects
                }
            }
        }
    },
    created: function() {
        // Set up project store and playground
        ipcRenderer.on('setUpProject', (e, data) => {
            initPlayground(data, this.$store);
            this.setUpProjectStore(data);
        });

        // Get data of project
        ipcRenderer.on('getProjectData', e => {
            e.sender.send('getProjectDataResponse', {
                projectData: this.projectData,
                store: this.$store.getters
            });
        });

        // Clipboard actions with game objects (supports only copying one object)
        // Copy
        ipcRenderer.on('copySelectedObjects', e => {
            document.execCommand('copy');
        });

        document.addEventListener('copy', e => {
            const getters = this.$store.getters;
            if(getters.selectedObjects.length) {
                e.clipboardData.setData(
                    'text/plain', 
                    getters.projectObjects[
                        getters.projectObjects.findIndex(item => item.$id === getters.selectedObjects[0])
                    ].$id
                );
                e.preventDefault();
            }
        });

        // Paste
        ipcRenderer.on('pasteSelectedObjects', e => {
            const getters = this.$store.getters;
            document.execCommand('paste');
        });

        document.addEventListener('paste', e => {
            const getters = this.$store.getters;
            const id = parseInt(e.clipboardData.getData('text/plain'));
            const obj = Object.assign(getters.projectObjects[getters.projectObjects.findIndex(item => item.$id === id)]);
            
            ipcRenderer.send('createObjectRequest', obj.settings);
        });
    }
}
</script>