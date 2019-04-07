<template>
    <div class="modal_mask">
        <div class="modal_container">
            <div class="modal_header">
                <span class="modal_title">{{ title }}</span>
                <button 
                    v-if="showExitBtn" 
                    class="btn_transparent" 
                    id="exit_btn" 
                    @click="$emit('close')"
                >
                    x
                </button>
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

<style>
    .modal_mask {
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .6);
        display: flex;
    }

    .modal_container {
        background-color: #fff;
        margin: auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        border-radius: 2px;
        position: relative;
    }

    .modal_header {
        display: flex;
        flex-direction: row;
        padding: 10px 15px;
    }

    .modal_header > span.modal_title {
        font-size: 28px;
        margin: 0 auto;
    }

    .modal_header > button#exit_btn {
        color: #666;
        width: 30px;
        font-size: 22px;
    }

    .modal_header > button#exit_btn:hover {
        color: #888;
    }

    .modal_body {
        padding: 15px;
        height: 435px;
        overflow-y: auto;
    }

    .modal_body, .modal_footer {
        border-top: 1px solid #ddd;
    }

    .modal_footer {
        padding: 10px 15px;
    }

    /* Container sizes */
    @media screen and (max-width: 1370px) {
        .modal_container {
            width: 95%;
        }
    }

    @media screen and (min-width: 1370px) {
        .modal_container {
            width: 70%;
        }
    }

    @media screen and (min-height: 800px) {
        .modal_body {
            height: 650px;
        }
    }

    @media screen and (min-height: 900px) {
        .modal_body {
            height: 780px;
        }
    }
</style>