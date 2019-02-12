<template>
    <div class="layer_item">
        <div class="thumbnail">
            <img :src="'https://via.placeholder.com/150x80?text=Layer+' + number" :alt="'Layer ' + number">
        </div>
        <p class="layer_number">{{ number }}</p>
    </div>
</template>
<script>
export default {
    props: {
        number: Number
    }
}
</script>
