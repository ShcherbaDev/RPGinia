<template>
    <div class="object_properties">
        <RectangleProperties :object="object" v-if="object.settings.type === 'rectangle'" />
        <TextProperties :object="object" v-if="object.settings.type === 'text'" />
    </div>
</template>
<script>
import RectangleProperties from './Objects/RectangleProperties';
import TextProperties from './Objects/TextProperties';

export default {
    components: { RectangleProperties, TextProperties },
    props: {
        object: Object
    }
}
</script>
