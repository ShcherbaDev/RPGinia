<template>
    <div>
        <div class="modal_body modal_settings" style="padding: 0">
            <div class="sidebar">
                <div class="section" v-for="section in sections" :key="section.id" :class="section.class">
                    <h1 class="section_title">{{ section.name }}</h1>
                    <ul class="section_tab_list">
                        <li v-for="tab in section.tabs" :key="tab.id">
                            <a href="#" @click="selectedTab = tab.value" :class="{ selected: selectedTab === tab.value }">{{ tab.name }}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="tab_content">
                <SettingsTabMain v-if="selectedTab === 'main'" />
                <SettingsTabOther v-else-if="selectedTab === 'other'" />
                
                <p v-else>There is no content for this tab...</p>
            </div>
        </div>
        <div class="modal_footer">
            <button class="btn btn_big btn_green" id="save">Save</button>
        </div>
    </div>
</template>
<script>
import SettingsTabMain from './SettingsTabs/SettingsTabMain';
import SettingsTabOther from './SettingsTabs/SettingsTabOther';

export default {
    data: function() {
        return {
            selectedTab: 'main',
            sections: [
                {
                    name: 'Test tab group 1',
                    class: 'main',
                    id: 1,
                    tabs: [
                        {
                            name: 'Main',
                            value: 'main',
                            id: 1
                        },
                        {
                            name: 'Main 2',
                            value: 'main2',
                            id: 2
                        }
                    ]
                },
                {
                    name: 'Test tab group 2',
                    class: 'other',
                    id: 2,
                    tabs: [
                        {
                            name: 'Other',
                            value: 'other',
                            id: 3
                        }
                    ]
                }
            ]
        }
    },
    components: { SettingsTabMain, SettingsTabOther }
}
</script>

<style src="../../assets/css/settings.css"></style>