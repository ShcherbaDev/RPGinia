<template>
    <div class="components">
        <Layers></Layers>
        <Properties></Properties>
        <Playground></Playground>
    </div>
</template>

<script>
import Layers from './blocks/Layers.vue';
import Properties from './blocks/Properties.vue';
import Playground from './blocks/Playground.vue';

export default {
    components: {
        Layers, Properties, Playground
    }    
}
</script>
