<template>
    <div class="modal-mask">
        <div class="modal-container">
            <div class="modal-header">
                <span class="modal-title">{{ title }}</span>
                <button v-if="showExitBtn" class="btn_transparent" id="exit_btn" @click="$emit('close')">x</button>
            </div>
            <slot>
                <div class="modal-body">Body</div>
                <div class="modal-footer">Footer</div>
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