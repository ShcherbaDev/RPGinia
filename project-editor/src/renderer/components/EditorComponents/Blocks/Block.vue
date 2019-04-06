<template>
    <div class="block" :class="className">
        <BlockTitle :title="title"
                    :add-button="titleAddButton" 
                    :delete-button="titleDeleteButton"
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
