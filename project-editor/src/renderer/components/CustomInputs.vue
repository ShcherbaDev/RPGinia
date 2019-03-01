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
            :value="id"
            @change="$emit('change', $event.target.checked)"
            v-else-if="type === 'checkbox'">

        <!-- Radio is not supported yet -->

        <!-- Number -->
        <input 
            :type="type" 
            :id="id" 
            :value="value" 
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
        value: [String, Number, Boolean],
        label: String,

        options: Array
    }
}
</script>
