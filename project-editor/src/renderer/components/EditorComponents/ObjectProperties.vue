<template>
    <div class="object_properties">
        <RectangleProperties 
            :object="object" 
            v-if="object.settings.type === 'rectangle'" 
        />

        <TextProperties 
            :object="object" 
            v-else-if="object.settings.type === 'text'" 
        />

        <SpriteProperties 
            :object="object"
            v-else-if="object.settings.type === 'sprite'" 
        />
    </div>
</template>
<script>
import RectangleProperties from './Objects/RectangleProperties';
import TextProperties from './Objects/TextProperties';
import SpriteProperties from './Objects/SpriteProperties';

export default {
    components: { RectangleProperties, TextProperties, SpriteProperties },
    props: {
        object: Object,
    }
}
</script>
