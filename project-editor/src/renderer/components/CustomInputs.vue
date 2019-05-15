<template>
    <div class="input_group" :class="{ row: type === 'color' || type === 'checkbox' }">
        <label :for="id">{{ label }}</label>
        
        <!-- Text -->
        <input 
            :type="type" 
            :id="id" 
            :value="value" 
            :disabled="disabled"
            @input="$emit('input', $event.target.value)"
            v-if="type === 'text'">

        <!-- Checkbox -->
        <input 
            :type="type" 
            :id="id"
            :checked="isChecked"
            :disabled="disabled"
            @change="$emit('change', $event.target.checked)"
            v-else-if="type === 'checkbox'">

        <!-- Number -->
        <input 
            :type="type" 
            :id="id" 
            :value="value" 
            :min="numMin"
            :max="numMax"
            :disabled="disabled"
            @input="$emit('input', parseInt($event.target.value))"
            v-else-if="type === 'number'">

        <!-- Color picker -->
        <input 
            :type="type" 
            :id="id" 
            :value="value"
            :disabled="disabled"
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
                :disabled="option.disabled">{{ option.text || option.value }}</option>
        </select>

        <!-- File -->
        <CustomFileInput 
            :id="id"
            :title="chooseFileTitle"
            :method="fileMethod"
            :file-path-text="filePathText"
            :is-open-directory="isOpenDirectory"
            :extension="fileExtension"
            :extension-label="fileExtensionLabel"
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

        disabled: Boolean,

        isChecked: Boolean,

        options: Array,

        numMin: Number,
        numMax: Number,

        chooseFileTitle: String,
        fileMethod: String,
        filePathText: String,
        isOpenDirectory: Boolean,
        fileExtension: String,
        fileExtensionLabel: String
    }
}
</script>
