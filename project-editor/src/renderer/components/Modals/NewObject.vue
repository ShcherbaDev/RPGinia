<template>
    <div class="modal_content">
        <div class="modal_body">
            <CustomInput 
                type="text" 
                id="objectName" 
                label="Object name:" 
                v-model="name" />

            <CustomInput 
                type="select" 
                id="objectType" 
                label="Object type:" 
                :options="types" 
                :value="type" 
                @change="type = $event" />

            <CustomInput 
                type="number" 
                id="objectLayer" 
                label="Object layer:"
                v-model="layer" />

            <h2>Coordinations:</h2>
            <CustomInput 
                type="number" 
                id="objectX" 
                label="X:"
                v-model="coords[0]" />

            <CustomInput 
                type="number" 
                id="objectY" 
                label="Y:"
                v-model="coords[1]" />

            <CustomInput 
                type="number" 
                id="objectWidth" 
                label="Width:"
                v-model="coords[2]"
                v-if="type !== 'text'" />

            <CustomInput 
                type="number" 
                id="objectHeight" 
                label="Height:"
                v-model="coords[3]"
                v-if="type !== 'text'" />

            <h2>Other settings:</h2>
            <!-- Settings for rectangles -->
            <CustomInput 
                type="color" 
                id="objectFill" 
                label="Object fill:"
                :value="fill" 
                @change="fill = $event"
                v-if="type === 'rectangle'" />

            <!-- Settings for texts -->
            <CustomInput 
                type="text" 
                id="objectText" 
                label="Object text:"
                :value="text" 
                @input="text = $event"
                v-if="type === 'text'" />

            <CustomInput 
                type="color" 
                id="objectColor" 
                label="Object color:"
                :value="color" 
                @change="color = $event"
                v-if="type === 'text'" />
        </div>
        <div class="modal_footer">
            <button 
                class="btn btn_big btn_green" 
                id="createObject" 
                v-if="name && type && layer && coords"
                @click="createObject">Create</button>
            <button class="btn btn_big btn_red" id="createObject" v-else disabled>Form is not valid</button>
        </div>
    </div>
</template>
<script>
import CustomInputs from '../CustomInputs';

export default {
    data() {
        return {
            name: 'Unnamed object',
            type: 'rectangle',
            layer: 1,
            types: [
                { id: 1, text: 'Rectangle', value: 'rectangle', disabled: false },
                { id: 3, text: 'Text', value: 'text', disabled: false },
                { id: 2, text: 'Sprite', value: 'sprite', disabled: true }
            ],
            coords: [
                0,
                0,
                32,
                32
            ],

            fill: '#ffffff',

            color: '#ffffff',
            text: 'Text'
        }
    },
    components: { CustomInput: CustomInputs },
    methods: {
        createObject: function() {
            if(this.name && this.type && this.layer && this.coords) {
                if(this.type === 'rectangle') {
                    this.$emit('createObject', {
                        name: this.name,
                        type: this.type,
                        settings: {
                            fill: this.fill
                        },
                        layer: this.layer,
                        coords: this.coords
                    });
                }

                else if(this.type === 'text') {
                    this.$emit('createObject', {
                        name: this.name,
                        type: this.type,
                        settings: {
                            color: this.color,
                            text: this.text
                        },
                        layer: this.layer,
                        coords: this.coords
                    });
                }
            }
            else console.error('Form is not valid!');
        }
    }
}
</script>
