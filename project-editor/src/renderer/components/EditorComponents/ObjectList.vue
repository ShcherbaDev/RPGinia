<template>
    <ul>
        <ObjectListItem v-for="obj in projectObjects" 
                        :key="obj.$id"
                        :name="obj.settings.name" 
                        :type="obj.settings.type"
                        :id="obj.$id"></ObjectListItem>
    </ul>
</template>

<script>
import { mapGetters } from 'vuex';
import '../../store/index.js';

import ObjectListItem from './ObjectListItem';

export default {
    components: { ObjectListItem },
    computed: mapGetters(['projectObjects'])
}
</script>
