<template>
    <div class="modal_content">
        <div class="modal_body modal_settings">
            <div class="sidebar">
                <div 
                    class="section" 
                    v-for="section in sections" 
                    :key="section.id" 
                    :class="section.class"
                >
                    <h1 class="section_title">{{ section.name }}</h1>
                    <ul class="section_tab_list">
                        <li v-for="tab in section.tabs" :key="tab.id">
                            <a 
                                href="#" 
                                @click="selectedTab = tab.value" 
                                :class="{ selected: selectedTab === tab.value }">{{ tab.name }}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="tab_content">
                <AppPlaygroundSettings v-if="selectedTab === 'appPlayground'" />
                <ProjectMainSettings v-else-if="selectedTab === 'projectMain'" />
                
                <p class="error_text" v-else>There is no content for this tab...</p>
            </div>
        </div>
        <div class="modal_footer">
            <button class="btn" id="save" @click="save">Save</button>
        </div>
    </div>
</template>
<script>
import AppPlaygroundSettings from './SettingsTabs/AppSettings/AppPlaygroundSettings';
import ProjectMainSettings from './SettingsTabs/ProjectSettings/ProjectMainSettings';

import { ipcRenderer } from 'electron';

export default {
    data() {
        return {
            selectedTab: 'appPlayground',
            sections: [
                {
                    name: 'App',
                    class: 'app',
                    id: 1,
                    tabs: [
                        {
                            name: 'Playground',
                            value: 'appPlayground',
                            id: 1
                        }
                    ]
                },
                {
                    name: 'Project',
                    class: 'project',
                    id: 2,
                    tabs: [
                        {
                            name: 'Project settings',
                            value: 'projectMain',
                            id: 1
                        }
                    ]
                }
            ]
        }
    },
    components: { AppPlaygroundSettings, ProjectMainSettings },
    methods: {
        save() {
            if(this.selectedTab === 'appPlayground') {
                const { playgroundWidth, playgroundHeight, playgroundAutoResizingEnabled } = this.$children[0];

                this.$store.commit('AppData/setPlaygroundSizes', [playgroundWidth, playgroundHeight]);
                this.$store.commit('AppData/setAutoPlaygroundResizing', playgroundAutoResizingEnabled);
                
                ipcRenderer.send('saveNewAppData', this.$store.getters);
            }

            if(this.selectedTab === 'projectMain') {
                const { projName, projBackground, projAppPath, includeSpriteSheet, projSpriteSheetPath } = this.$children[0];

                this.$store.commit('setProjectSetting', {
                    settingName: 'name',
                    newValue: projName
                });

                this.$store.commit('setProjectSetting', {
                    settingName: 'background',
                    newValue: projBackground
                });

                this.$store.commit('setProjectSetting', {
                    settingName: 'spriteSheetPath',
                    newValue: includeSpriteSheet ? projSpriteSheetPath.replace(/\\\\/g, '\\').replace(projAppPath, '') : ''
                });

                this.$store.commit('setProjectAppPath', projAppPath);
            
                ipcRenderer.send('saveNewProjectData', this.$store.getters);
            }
        }
    }
}
</script>

<style src="../../assets/css/settings.css"></style>