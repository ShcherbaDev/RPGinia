<template>
    <div class="title">
        <div 
            class="title_grid" 
            v-if="sideButtons || addButton || deleteButton"
        >
            <div class="left">
                <p>{{ title }}</p>
            </div>
            <div class="right">
                <button 
                    class="btn_transparent" 
                    id="add" 
                    v-if="sideButtons || addButton" 
                    @click="$emit('add')"
                >+</button>
                <button 
                    class="btn_transparent" 
                    id="delete"
                    v-if="sideButtons || deleteButton" 
                    @click="$emit('delete')"
                >-</button>
            </div>
        </div> 
        <p v-else>{{ title }}</p>
    </div>
</template>
<script>
export default {
    props: {
        title: String,
        sideButtons: Boolean,
        addButton: Boolean,
        deleteButton: Boolean
    }
}
</script>
