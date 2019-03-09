<template>
    <div class="input_group">
        <label :for="id">{{ label }}</label>
        
        <!-- Text -->
        <input 
            :type="type" 
            :id="id" 
            :value="value" 
            @input="$emit('input', $event.target.value)"
            v-if="type === 'text'">

        <!-- Checkbox -->
        <input 
            :type="type" 
            :id="id"
            :checked="isChecked"
            @change="$emit('change', $event.target.checked)"
            v-else-if="type === 'checkbox'">

        <!-- Radio is not supported yet -->

        <!-- Number -->
        <input 
            :type="type" 
            :id="id" 
            :value="value" 
            :min="numMin"
            :max="numMax"
            @input="$emit('input', parseInt($event.target.value))"
            v-else-if="type === 'number'">

        <!-- Color picker -->
        <input 
            :type="type" 
            :id="id" 
            :value="value"
            @change="$emit('change', $event.target.value)"
            v-else-if="type === 'color'">

        <!-- Select -->
        <select 
            :id="id" 
            :name="id" 
            @change="$emit('change', $event.target.value)" 
            v-else-if="type === 'select'">
            <option 
                v-for="option in options" 
                :key="option.id"
                :value="option.value" 
                :disabled="option.disabled">{{ option.text }}</option>
        </select>

        <!-- File -->
        <CustomFileInput 
            :id="id"
            :title="chooseFileTitle"
            :method="fileMethod"
            :isOpenDirectory="isOpenDirectory"
            @input="$emit('input', $event)"
            v-else-if="type === 'file'" />
    </div>
</template>
<script>
import CustomFileInput from './CustomFileInput';

export default {
    components: { CustomFileInput },
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        id: String,
        type: {
            type: String,
            default: 'text'
        },
        value: [String, Number],
        label: String,

        isChecked: Boolean,

        options: Array,

        numMin: Number,
        numMax: Number,

        chooseFileTitle: String,
        fileMethod: String,
        isOpenDirectory: Boolean
    }
}
</script>
