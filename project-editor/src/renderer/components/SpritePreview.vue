<template>
    <div class="sprite_preview">
        <canvas id="preview"></canvas>
    </div>
</template>
<script>
import initPreviewCanvas from '../assets/js/spritePreview';
import { ipcRenderer } from 'electron';

export default {
    mounted() {
        ipcRenderer.send('requestSetSpritePreviewToActive');
        initPreviewCanvas(this);
    },
    destroyed() {
        ipcRenderer.send('requestSetSpritePreviewToNotActive');
    }
}
</script>
