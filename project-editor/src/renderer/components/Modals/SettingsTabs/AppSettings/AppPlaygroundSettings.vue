<template>
    <div>
        <h1>Playground</h1>

        <h2>Sizes</h2>
        <CustomInput
            type="number"
            id="playgroundWidth"
            label="Width:"
            :num-min="0"
            v-model="playgroundWidth"
            :disabled="playgroundAutoResizingEnabled" 
        />

        <CustomInput
            type="number"
            id="playgroundHeight"
            label="Height:"
            :num-min="0"
            v-model="playgroundHeight"
            :disabled="playgroundAutoResizingEnabled" 
        />

        <CustomInput 
            type="checkbox"
            id="autoPlaygroundResizing"
            label="Auto resizing:"
            :is-checked="playgroundAutoResizingEnabled"
            @change="playgroundAutoResizingEnabled = $event" 
        />
    </div>
</template>
<script>
import CustomInputs from '../../../CustomInputs';

import '../../../../store/index.js';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            playgroundWidth: 0,
            playgroundHeight: 0,
            playgroundAutoResizingEnabled: false
        }
    },

    components: { CustomInput: CustomInputs },
    computed: mapGetters('EditorData', ['playgroundSizes', 'autoPlaygroundSizesEnabled']),
    mounted() {
        this.playgroundWidth = this.playgroundSizes[0];
        this.playgroundHeight = this.playgroundSizes[1];
        this.playgroundAutoResizingEnabled = this.autoPlaygroundSizesEnabled;
    }
}
</script>
