<template>
    <div :class="'properties_block ' + className">
        <BlockTitle :title="title"
                    :addButton="titleAddButton" 
                    :deleteButton="titleDeleteButton"></BlockTitle>
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
