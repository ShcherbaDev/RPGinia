<template>
    <div :class="'block ' + className">
        <BlockTitle :title="title"
                    :addButton="titleAddButton" 
                    :deleteButton="titleDeleteButton"
                    @add="$emit('add')"
                    @delete="$emit('delete')" />
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
import BlockTitle from './BlockTitle';

export default {
    props: {
        className: String,
        title: String,
        titleAddButton: Boolean,
        titleDeleteButton: Boolean
    },
    components: { BlockTitle }
}
</script>
