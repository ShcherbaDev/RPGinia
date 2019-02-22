<template>     
    <div class="object_settings">
        <h1>{{ object.name }}</h1>
        <div class="form_group">
            <label for="objectName">Name:</label>
            <input type="text" 
                    id="objectName" 
                    name="objectName" 
                    :value="object.name" 
                    @input="setObjectProperty({id: object.$id, property: 'name', newPropertyValue: $event.target.value})">
        </div>

        <h2>Coordinations:</h2>
        <div class="form_group">
            <label for="objectX">X:</label>
            <input type="number" 
                    id="objectX" 
                    name="objectX" 
                    :value="object.coords[0]" 
                    @input="setObjectProperty({id: object.$id, property: 'coords', propertySetting: '0', newPropertyValue: parseInt($event.target.value)})">
        </div>
        <div class="form_group">
            <label for="objectY">Y:</label>
            <input type="number" 
                    id="objectY" 
                    name="objectY" 
                    :value="object.coords[1]" 
                    @input="setObjectProperty({id: object.$id, property: 'coords', propertySetting: '1', newPropertyValue: parseInt($event.target.value)})">
        </div>
        <div class="form_group">
            <label for="objectWidth">Width:</label>
            <input type="number" 
                    id="objectWidth" 
                    name="objectWidth" 
                    :value="object.coords[2]" 
                    @input="setObjectProperty({id: object.$id, property: 'coords', propertySetting: '2', newPropertyValue: parseInt($event.target.value)})">
        </div>
        <div class="form_group">
            <label for="objectHeight">Height:</label>
            <input type="number" 
                    id="objectHeight" 
                    name="objectHeight" 
                    :value="object.coords[3]" 
                    @input="setObjectProperty({id: object.$id, property: 'coords', propertySetting: '3', newPropertyValue: parseInt($event.target.value)})">
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

import '../../../store/index.js';

export default {
    computed: mapGetters(['projectObjects', 'selectedObjects']),
    methods: {
        ...mapActions(['setObjectProperty'])
    },
    props: {
        object: Object
    }
}
</script>
