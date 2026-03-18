<template>
    <div class="input-group">
        <div class="line1">
            <label :for="name" :class="{ 'underline': underline }">
                {{ index !== undefined ? `${name} - ${index + 1}` : name }}
            </label>
            <span v-if="index !== undefined && removeSolution && index !== 0" class="error"
                @click="removeSolution(index)">&times;</span>
        </div>
        <textarea :name="name" v-model="textData" :placeholder="placeholder" rows="5" :class="{ 'error': hasError }" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    placeholder: string,
    name: string,
    index?: number,
    removeSolution?: (index: number) => void
    hasError?: boolean
    underline?: boolean
}>()

const solution = defineModel<string[]>()

const textData = computed({
    get() {
        return solution.value?.join('\n') || '';
    },
    set(newValue: string) {
        solution.value = newValue.split('\n').map(line => line.trim());
    }
})

</script>

<style>
.input-group .line1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.5rem;
}

.input-group .line1 span.error {
    font-size: 1.5rem;
    cursor: pointer;
}
</style>