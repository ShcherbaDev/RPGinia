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
                <p class="error_text" v-if="projectObjects.length === 0">
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
                <p class="error_text" v-if="selectedObjects.length === 0">Object not selected.</p>
                <ObjectProperties v-for="objId in selectedObjects"
                                  :key="objId"
                                  :object="projectObjects[projectObjects.findIndex(item => item.$id === objId)]"
                                  :spriteSheets="projectSpriteSheets"
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
import selectObjects from '../assets/js/selectObjects';
import initClipboardActions from '../assets/js/clipboard';

export default {
    name: 'editor',
    components: {
        Block, ObjectListItem, ObjectProperties, Playground
    },
    methods: {
        ...mapActions(['addObject', 'clearProjectStore', 'clearSelectedObjects']),

        createObject: function() {
            ipcRenderer.send('requestModalOpen', 'createObject');
        },

        deleteObject: function() {
            for(let selectedObjectId of this.selectedObjects)
                ipcRenderer.send('requestDeleteObject', this.projectObjects.findIndex(item => item.$id === selectedObjectId));
        }
    },
    computed: {
        ...mapGetters(['projectSettings', 'projectObjects', 'selectedObjects', 'projectSpriteSheets']),

        projectData: function() {
            if(this.$store.getters.projectType === 'level') {
                return {
                    settings: this.$store.getters.projectSettings,
                    elements: this.$store.getters.projectObjects
                };
            }
        }
    },
    created: function() {
        // Actions on setting up project
        ipcRenderer.on('setUpProject', (e, data) => {
            // console.log(data.data.elements[0]);
            // If the click was not on the list of objects - deselect all objects
            document.querySelector('.block.object_list > .content').addEventListener('click', e => {
                if(this.selectedObjects.length > 0 && e.path.findIndex(item => item.tagName === 'UL') === -1)
                    this.clearSelectedObjects();
            });

            // Initialize playground - connect engine and draw objects
            initPlayground(data, this.$store);
        });

        // Get data of project
        ipcRenderer.on('getProjectData', e => {
            e.sender.send('getProjectDataResponse', {
                projectData: this.projectData,
                store: this.$store.getters
            });
        });

        // 'addObject' event is on renderer/assets/canvas.js

        // Delete object
        ipcRenderer.on('deleteObject', (e, objectIndex) => this.$store.dispatch('deleteObject', objectIndex));

        // Initialize clipboard actions for game objects (supports only one object)
        initClipboardActions(this.$store, document);
    }
}
</script>