<template>
    <div>
        <div class="modal_body modal_settings" style="padding: 0">
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
                <PlaygroundSettings v-if="selectedTab === 'playground'" />
                
                <p v-else>There is no content for this tab...</p>
            </div>
        </div>
        <div class="modal_footer">
            <button class="btn" id="save" @click="save">Save</button>
        </div>
    </div>
</template>
<script>
import PlaygroundSettings from './SettingsTabs/PlaygroundSettings';

export default {
    data: function() {
        return {
            selectedTab: 'playground',
            sections: [
                {
                    name: 'App',
                    class: 'app',
                    id: 1,
                    tabs: [
                        {
                            name: 'Playground',
                            value: 'playground',
                            id: 1
                        },
                        {
                            name: 'Appereance',
                            value: 'appereance',
                            id: 2
                        }
                    ]
                }
            ]
        }
    },
    components: { PlaygroundSettings },
    methods: {
        save: function(e) {
            console.log(e)
        }
    }
}
</script>

<style src="../../assets/css/settings.css"></style>