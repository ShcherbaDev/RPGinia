<template>
    <div class="sprite_preview">
        <canvas id="preview"></canvas>
    </div>
</template>
<script>
import initPreviewCanvas from '../assets/js/spritePreview';

export default {
    mounted() {
        initPreviewCanvas(this);
    }
}
</script>
