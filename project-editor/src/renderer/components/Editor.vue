<template>
    <div class="editor">
        <Block className="layers" title="Layers" titleAddButton titleDeleteButton>
            <div class="layer_list">
                <LayerItem :number="1"></LayerItem>
                <LayerItem :number="2"></LayerItem>
            </div>
        </Block>
        
        <div class="block properties">
            <PropertiesBlock className="objects" title="Object list" titleAddButton titleDeleteButton>
                <p class="error_text" v-if="!projectObjects.length">
                    Object list is empty!
                </p>
                <ObjectList v-else></ObjectList>
            </PropertiesBlock>
            <PropertiesBlock className="object" title="Object properties">
                <p class="error_text" v-if="!selectedObjects.length">Object not selected.</p>
                <ObjectProperties v-for="objId in selectedObjects"
                                  :key="projectObjects[projectObjects.findIndex(item => item.$id === objId)].$id"
                                  :object="projectObjects[projectObjects.findIndex(item => item.$id === objId)]"
                                  v-else></ObjectProperties>
            </PropertiesBlock>
        </div>

        <Block className="playground" title="Playground">
            <div class="canvas_container">
                <canvas id="playground"></canvas>
            </div>
        </Block>
    </div>
</template>
<script>
import Block from './EditorComponents/Blocks/Block';
import PropertiesBlock from './EditorComponents/Blocks/PropertiesBlock';
import LayerItem from './EditorComponents/LayerItem';
import ObjectList from './EditorComponents/ObjectList';
import ObjectProperties from './EditorComponents/ObjectProperties';

import { mapGetters, mapActions } from 'vuex';

import '../store/index.js';

import { ipcRenderer } from 'electron';

import initPlayground from '../assets/js/canvas.js';

export default {
    name: 'editor',
    components: {
        Block, PropertiesBlock, LayerItem, ObjectList, ObjectProperties
    },
    methods: mapActions(['setUpProjectStore']),
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
        ipcRenderer.on('setUpProject', (e, data) => {
            initPlayground(data, this.$store);
            this.setUpProjectStore(data);
        });

        ipcRenderer.on('getProjectData', e => {
            e.sender.send('getProjectDataResponse', {
                projectData: this.projectData,
                store: this.$store.getters
            })
        });
    }
}
</script>