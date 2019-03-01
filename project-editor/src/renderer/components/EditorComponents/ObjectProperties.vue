<template>
    <RectangleProperties :object="object" v-if="object.settings.type === 'rectangle'" />
</template>
<script>
import RectangleProperties from './Objects/RectangleProperties';

export default {
    components: { RectangleProperties },
    props: {
        object: Object
    }
}
</script>
