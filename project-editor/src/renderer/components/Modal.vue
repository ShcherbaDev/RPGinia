<template>
    <div class="modal_mask">
        <div class="modal_container">
            <div class="modal_header">
                <span class="modal_title">{{ title }}</span>
                <button v-if="showExitBtn" class="btn_transparent" id="exit_btn" @click="$emit('close')">x</button>
            </div>
            <slot>
                <div class="modal_body">Body</div>
                <div class="modal_footer">Footer</div>
            </slot>
        </div>
    </div>
</template>
<script>
import { ipcRenderer } from 'electron';

export default {
    props: {
        title: {
            type: String,
            default: 'Modal title'
        },
        showExitBtn: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style src="../assets/css/modal.css"></style>