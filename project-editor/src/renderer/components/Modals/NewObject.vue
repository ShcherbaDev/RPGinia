<template>
    <div class="modal_content">
        <div class="modal_body">
            <!-- Main settings -->
            <h2>Main settings:</h2>
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
                :numMin="0"
                v-model="coords[2]"
                v-if="type !== 'text'" />

            <CustomInput 
                type="number" 
                id="objectHeight" 
                label="Height:"
                :numMin="0"
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

            <CustomInput
                type="number"
                id="objectSize"
                label="Size:"
                :numMin="0"
                v-model="textSize"
                v-if="type === 'text'" />

            <!-- Settings for sprites -->
            <CustomInput
                type="number"
                id="objectSpriteSheetIndex"
                label="Sprite sheet index:"
                :numMin="0"
                :numMax="projectSpriteSheets.length-1"
                :value="spriteSheetIndex"
                @input="setSpriteSheetIndex"
                v-if="type === 'sprite'" />

            <CustomInput
                type="number"
                id="objectSpriteIndex"
                label="Sprite index:"
                :numMin="0"
                :numMax="projectSpriteSheets[spriteSheetIndex].sprites.length-1"
                :value="spriteIndex"
                @input="setSpriteIndex"
                v-if="type === 'sprite'" />

            <CustomInput
                type="number"
                id="objectFrameIndex"
                label="Frame index:"
                :numMin="0"
                :numMax="projectSpriteSheets[spriteSheetIndex].sprites[spriteIndex].frames.length-1"
                v-model="frameIndex"
                v-if="type === 'sprite' && projectSpriteSheets[spriteSheetIndex].sprites[spriteIndex].frames" />
        
            <h2 v-if="type === 'sprite'">Preview:</h2>
            <SpritePreview v-if="type === 'sprite'"></SpritePreview>
        </div>
        <div class="modal_footer">
            <button 
                class="btn"
                v-if="name && type && layer && coords && fill"
                @click="createObject">Create</button>
            <button class="btn" v-else disabled>Form is not valid</button>
        </div>
    </div>
</template>
<script>
import CustomInputs from '../CustomInputs';
import SpritePreview from '../SpritePreview';

import '../../store/index.js';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            name: 'Unnamed object',
            type: 'rectangle',
            layer: 1,
            types: [
                { id: 1, text: 'Rectangle', value: 'rectangle', disabled: false },
                { id: 3, text: 'Text', value: 'text', disabled: false },
                { id: 2, text: 'Sprite', value: 'sprite', disabled: this.projectSpriteSheets !== undefined }
            ],
            coords: [
                0,
                0,
                32,
                32
            ],

            fill: '#ffffff',

            color: '#ffffff',
            text: 'Text',
            textSize: 32,

            spriteSheetIndex: 0,
            spriteIndex: 0,
            frameIndex: 0
        }
    },
    components: { SpritePreview, CustomInput: CustomInputs },
    computed: mapGetters(['projectSpriteSheets']),
    methods: {
        createObject() {
            if(this.name !== '' && this.type !== '' && this.layer !== null && this.coords !== []) {
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
                    const textCoords = this.coords.splice(1, 2);

                    this.$emit('createObject', {
                        name: this.name,
                        type: this.type,
                        settings: {
                            color: this.color,
                            text: this.text,
                            size: this.textSize
                        },
                        layer: this.layer,
                        coords: this.coords
                    });
                }
            }
            else console.error('Form is not valid!');
        },

        setSpriteSheetIndex(event) {
            this.spriteSheetIndex = event;
            this.spriteIndex = 0;
            this.frameIndex = 0;
        },

        setSpriteIndex(event) { 
            this.spriteIndex = event;
            this.frameIndex = 0;
        }
    }
}
</script>
