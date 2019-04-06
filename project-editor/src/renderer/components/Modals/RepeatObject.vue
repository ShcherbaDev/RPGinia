<template>
    <div class="modal_content">
        <div class="modal_body">
            <CustomInput
                type="number"
                id="repeatByColumn"
                label="Repeat by column:"
                :num-min="0"
                v-model="repeatByColumn" />

            <CustomInput
                type="number"
                id="repeatByRow"
                label="Repeat by row:"
                :num-min="0"
                v-model="repeatByRow" />

            <h2 v-if="repeatByColumn > 0 || repeatByRow > 0">Intervals:</h2>
            <CustomInput
                type="number"
                id="horizontalInterval"
                label="Horizontal interval"
                v-model="horizontalInterval"
                v-if="repeatByColumn > 0" />

            <CustomInput
                type="number"
                id="repeatByRow"
                label="Vertical interval:"
                v-model="verticalInterval"
                v-if="repeatByRow > 0" />
        </div>
        <div class="modal_footer">
            <button class="btn" @click="repeatObject">Repeat</button>
        </div>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import CustomInputs from '../CustomInputs';

import '../../store/index.js';
import { mapGetters } from 'vuex';

export default {
    data: function() {
        return {
            repeatByColumn: 0,
            repeatByRow: 0,
            horizontalInterval: 0,
            verticalInterval: 0
        }
    },
    components: { CustomInput: CustomInputs },
    computed: mapGetters(['projectObjects']),
    methods: {
        repeatObject() {
            const { projectObjects, objectId, repeatByColumn, repeatByRow, horizontalInterval, verticalInterval } = this;
            const repeatedObject = projectObjects[projectObjects.findIndex(item => item.$id === objectId)];
            
            this.$emit('repeatObject', { repeatedObject, repeatByColumn, repeatByRow, horizontalInterval, verticalInterval });
        }
    },
    props: {
        objectId: Number
    },

    mounted() {
        const coords = this.projectObjects[this.projectObjects.findIndex(item => item.$id === this.objectId)].settings.coords;

        this.horizontalInterval = coords[2];
        this.verticalInterval = coords[3];
    }
}
</script>
