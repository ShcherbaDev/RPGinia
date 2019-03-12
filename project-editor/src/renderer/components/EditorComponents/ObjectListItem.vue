<template>
    <li class="obj_list_item" :class="{ selected: this.isObjectSelected }" @click="select">
        <div class="icon">
            <img src="static/images/rectangleIcon.png" alt="Rectangle icon" v-if="type === 'rectangle'">
            <img src="static/images/textIcon.png" alt="Text icon" v-else-if="type === 'text'">

            <img src="static/images/missingObjectIcon.png" alt="Undefined object type icon" v-else>
        </div>
        <div class="name">{{ name }}</div>
        <div class="type">
            {{ type[0].toUpperCase() + type.slice(1) }}
        </div>
    </li>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import '../../store/index.js';

export default {
    computed: {
        ...mapGetters(['selectedObjects']),

        isObjectSelected: function() {
            return this.selectedObjects.indexOf(this.id) !== -1;
        }
    },
    methods: {
        ...mapActions(['selectObject', 'unselectObject', 'clearSelectedObjects']),
        
        select: function(event) {
            const isCtrlKey = event.ctrlKey;

            if(!this.isObjectSelected) {
                for(let i in this.selectedObjects) {
                    this.unselectObject({ 
                        from: i, 
                        to: 1
                    });
                }
                this.selectObject(this.id);
            }

            else {
                for(let i in this.selectedObjects) {
                    this.unselectObject({ 
                        from: i, 
                        to: 1
                    });
                }
            }
        }
    },
    created: function() {
        this.clearSelectedObjects();
    },
    props: {
        name: String,
        type: String,
        id: Number
    }
}
</script>
