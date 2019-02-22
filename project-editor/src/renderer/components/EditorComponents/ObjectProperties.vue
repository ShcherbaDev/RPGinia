<template>
    <Rectangle :object="object.settings"></Rectangle>
</template>
<script>
import Rectangle from './Objects/Rectangle';

export default {
    components: { Rectangle },
    props: {
        object: Object
    }
}
</script>
