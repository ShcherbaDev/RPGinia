<template>
    <div class="custom_file_input" :id="id">
        <div class="result_field">
            <p id="filePath" v-if="!isOpenDirectory">File is not choosed</p>
            <p id="filePath" v-else>Directory is not choosed</p>
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
        },
        isOpenDirectory: {
            type: Boolean,
            default: 'false'
        }
    },
    methods: {
        requestChoosingFile: function() {
            const title = this.title;
            const method = this.method;
            const isOpenDirectory = this.isOpenDirectory;
            const extension = this.extension;
            const extensionLabel = this.extensionLabel;

            const filePath = ipcRenderer.sendSync('requestChooseFile', { title, method, name: extensionLabel, isOpenDirectory, extensions: [extension] });
            document.querySelector(`.custom_file_input#${this.id} p#filePath`).innerHTML = filePath.replace(/\\\\/g, '\\');
            this.$emit('input', filePath);
        }
    }
}
</script>
