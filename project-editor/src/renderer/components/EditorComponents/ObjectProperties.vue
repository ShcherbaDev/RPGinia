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

        <TriggerProperties
            :object="object"
            v-else-if="object.settings.type === 'trigger'"
        />

        <p 
            class="error_text" 
            v-else
        >
            This object type doesn't have any options there!
        </p>
    </div>
</template>
<script>
import RectangleProperties from './Objects/RectangleProperties';
import TextProperties from './Objects/TextProperties';
import SpriteProperties from './Objects/SpriteProperties';
import TriggerProperties from './Objects/TriggerProperties';

export default {
    components: { RectangleProperties, TextProperties, SpriteProperties, TriggerProperties },
    props: {
        object: Object,
    }
}
</script>
