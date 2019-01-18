<template>
    <div class="block layers">
        <div class="title">
            <div class="title_grid">
                <div class="left">
                    <p>{{ blockTitle }}</p>
                </div>
                <div class="right">
                    <button class="btn_transparent" id="add_layer">+</button>
                </div>
            </div> 
        </div>
        <div class="content">
            <div class="layer_list">
                <div class="layer_item">
                    <div class="thumbnail">
                        <img src="https://via.placeholder.com/150x80?text=Layer+1" alt="Layer 1">
                    </div>
                    <p class="layer_number">1</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            blockTitle: 'Layers'
        }
    }
}
</script>
