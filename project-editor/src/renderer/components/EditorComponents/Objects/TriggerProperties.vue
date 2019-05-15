<template>     
    <div class="object_settings">
        <h1>{{ object.settings.name }}</h1>
        <CustomInput
            type="text"
            id="objectName"
            label="Name:"
            :value="object.settings.name"
            @input="setObjectProperty({ id: object.$id, property: 'name', newPropertyValue: $event })" 
        />

        <h2>Coordinations:</h2>
        <CustomInput
            type="number"
            id="objectX"
            label="X:"
            :value="object.settings.coords[0]"
            @input="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '0', newPropertyValue: $event })" 
        />

        <CustomInput
            type="number"
            id="objectY"
            label="Y:"
            :value="object.settings.coords[1]"
            @input="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '1', newPropertyValue: $event })" 
        />
        
        <CustomInput
            type="number"
            id="objectWidth"
            label="Width:"
            :value="object.settings.coords[2]"
            @input="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '2', newPropertyValue: $event })" 
        />
        
        <CustomInput
            type="number"
            id="objectHeight"
            label="Height:"
            :value="object.settings.coords[3]"
            @input="setObjectProperty({ id: object.$id, property: 'coords', propertySetting: '3', newPropertyValue: $event })" 
        />
    </div>
</template>
<script>
import CustomInputs from '../../CustomInputs';
import convertColorNameToHex from '../../../assets/js/convertColorNameToHex';
import { ipcRenderer } from 'electron';

import '../../../store/index.js';
import { mapGetters, mapActions } from 'vuex';

export default {
    components: { CustomInput: CustomInputs },
    computed: mapGetters(['projectObjects', 'selectedObjects']),
    methods: {
        ...mapActions(['setObjectProperty']),

        parseToHex(color) { 
            return convertColorNameToHex(color);
        },

        openRepeatModal() {
            ipcRenderer.send('requestModalOpen', 'repeatObject', this.object.$id);
        }
    },
    props: {
        object: Object
    }
}
</script>
