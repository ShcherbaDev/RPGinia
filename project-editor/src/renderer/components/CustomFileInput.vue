<template>
    <div class="custom_file_input" :id="id">
        <div class="result_field">
            <p id="filePath">File path is not choosed</p>
        </div>
        <div class="choose_btn">
            <a href="#" class="choose_btn" :id="`chooseBtn ${id}_btn`" @click="requestChoosingFile">Choose</a>
        </div>
    </div>
</template>
<script>
import { ipcRenderer } from 'electron';

export default {
    props: {
        title: String,
        method: String,
        id: String,
        extensionLabel: {
            type: String,
            default: 'JSON file'
        },
        extension: {
            type: String,
            default: 'json'
        }
    },
    methods: {
        requestChoosingFile: function() {
            const title = this.title;
            const method = this.method;
            const extension = this.extension;
            const extensionLabel = this.extensionLabel;

            const filePath = ipcRenderer.sendSync('requestChooseFile', { title, method, name: extensionLabel, extensions: [extension] });
            document.querySelector(`.custom_file_input#${this.id} p#filePath`).innerHTML = filePath.replace(/\\\\/g, '\\');
            this.$emit('input', filePath);
        }
    }
}
</script>
