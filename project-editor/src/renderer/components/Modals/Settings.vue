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
                        <li 
                            v-for="tab in section.tabs"
                            :key="tab.id"
                        >
                            <a 
                                href="#" 
                                @click="selectedTab = tab.value" 
                                :class="{ selected: selectedTab === tab.value }"
                            >{{ tab.name }}</a>
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
            <button 
                class="btn" 
                id="save" 
                @click="save"
            >Save</button>
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

                this.$store.commit('EditorData/setPlaygroundSizes', [playgroundWidth, playgroundHeight]);
                this.$store.commit('EditorData/setAutoPlaygroundResizing', playgroundAutoResizingEnabled);
                
                ipcRenderer.send('saveNewEditorData', this.$store.getters);
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

<style>
    .modal_body.modal_settings {
        display: grid;
        grid-template-columns: 20% 1fr;
        min-height: 470px;
        padding: 0;
    }

    .modal_settings > .sidebar {
        padding: 10px;
        background-color: #2d2d2d;
    }

    .modal_body.modal_settings > .sidebar h1.section_title {
        padding-bottom: 10px;
        padding-left: 5px;
        margin-bottom: 10px;
        border-bottom: 1px solid #555;
    }

    .modal_body.modal_settings > .sidebar > .section:not(:first-child) h1.section_title {
        margin-top: 10px;
    }

    .modal_body.modal_settings > .sidebar ul.section_tab_list li a {
        display: block;
        padding: 8px 10px;
        color: #fff;
        text-decoration: none;
    }

    .modal_body.modal_settings > .sidebar ul.section_tab_list li a.selected {
        background-color: rgba(255, 255, 255, .1);
    }

    .modal_body.modal_settings > .sidebar ul.section_tab_list li a:hover {
        background-color: rgba(255, 255, 255, .2);
    }

    .modal_body.modal_settings > .tab_content {
        padding: 10px;
    }

    /* Container sizes */
    @media screen and (max-width: 1370px) {
        .modal_body.modal_settings {
            grid-template-columns: 1fr 70%;
        }
    }

    @media screen and (min-width: 1370px) {
        .modal_body.modal_settings {
            grid-template-columns: 20% 1fr;
        }
    }
</style>