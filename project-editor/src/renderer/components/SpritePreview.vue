<template>
    <div class="sprite_preview">
        <h2>Preview:</h2>
        <canvas id="preview"></canvas>
        <!-- <img 
            :src="`${this.ProjectData.appPath}/${this.ProjectData.spriteSheets[this.NewObjectData.spriteSheetIndex].file}`"
            :style="{
                border: '1px solid red'
            }"
            :width="$store.getters['NewObjectData/coords'][2]"
            :height="$store.getters['NewObjectData/coords'][3]"
            alt="Sprite preview"> -->
        <!-- <div 
            class="preview_image"
            :style="{
                border: '1px solid red',
                width: this.$store.getters['NewObjectData/coords'][2] + 'px',
                height: this.$store.getters['NewObjectData/coords'][3] + 'px',
                backgroundImage: `url(${this.ProjectData.appPath}/${this.ProjectData.spriteSheets[this.NewObjectData.spriteSheetIndex].file})`,
                backgroundSize: `${this.$store.getters['NewObjectData/coords'][2]}px, ${this.$store.getters['NewObjectData/coords'][3]}px`
            }"></div> -->
    </div>
</template>
<script>
import initPreviewCanvas from '../assets/js/spritePreview';

export default {
    mounted: function() {
        initPreviewCanvas(this);
    }
}
</script>
