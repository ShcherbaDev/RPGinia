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
            <button class="btn" style="margin-top: 10px;" v-if="type === 'sprite'" @click="setOriginalSizes('width')">Set to original sprite width</button>

            <CustomInput 
                type="number" 
                id="objectHeight" 
                label="Height:"
                :numMin="0"
                v-model="coords[3]"
                v-if="type !== 'text'" />
            <button class="btn" style="margin-top: 10px;" v-if="type === 'sprite'" @click="setOriginalSizes('height')">Set to original sprite height</button>

            <h2 v-if="type !== 'sprite'">Other settings:</h2>
            <h2 v-else>Select sprite:</h2>
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
            <SelectSprite
                :spriteSheets="projectSpriteSheets"
                v-if="type === 'sprite'"
                @select="setSprite" />
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
import SelectSprite from '../EditorComponents/SelectSprite';

import * as originalSpriteSizes from '../../assets/js/setOriginalSpriteSizes';

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
    components: { SelectSprite, CustomInput: CustomInputs },
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

                else if(this.type === 'sprite') {
                    let objSettings = {
                        name: this.name,
                        type: this.type,
                        settings: {
                            spriteSheetIndex: this.spriteSheetIndex,
                            spriteIndex: this.spriteIndex
                        },
                        layer: this.layer,
                        coords: this.coords
                    }

                    if(this.projectSpriteSheets[this.spriteSheetIndex].sprites[this.spriteIndex].frames) {
                        objSettings.settings.frameIndex = this.frameIndex;
                    }

                    this.$emit('createObject', objSettings);
                }
            }
            else console.error('Form is not valid!');
        },

        setSprite(event) {
            this.spriteSheetIndex = event.spriteSheetIndex;
            this.spriteIndex = event.spriteIndex;
        },

        setOriginalSizes(type) {
            const { spriteSheetIndex, spriteIndex, frameIndex, projectSpriteSheets } = this;

            if(type === 'width') {
                this.coords[2] = originalSpriteSizes.setOriginalWidth(spriteSheetIndex, spriteIndex, frameIndex, projectSpriteSheets); 

                document.querySelector('.modal_container input#objectWidth').value = this.coords[2];
            }

            else if(type === 'height') {
                this.coords[3] = originalSpriteSizes.setOriginalHeight(spriteSheetIndex, spriteIndex, frameIndex, projectSpriteSheets);

                document.querySelector('.modal_container input#objectHeight').value = this.coords[3];
            }
        }
    }
}
</script>
