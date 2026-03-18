<template>
    <div class="input-group">
        <div class="one-line">
            <label :for="name" :class="{ 'underline': underline }">
                {{ index !== undefined ? `${name} - ${index + 1}` : name }}
            </label>
            <span v-if="index !== undefined && removeSolution && index !== 0"
                @click="removeSolution(index)">&times;</span>
        </div>
        <textarea :name="name" v-model="textData" :placeholder="placeholder" rows="5" :class="{ 'error': hasError }" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ICreateSolution } from '../types/problem';

const props = defineProps<{
    placeholder: string,
    name: string,
    index?: number,
    removeSolution?: (index: number) => void
    hasError?: boolean
    underline?: boolean
}>()

const solution = defineModel<ICreateSolution>()

const textData = computed({
    get() {
        return solution.value?.solutions.join('\n') || '';
    },
    set(newValue: string) {
        if (solution.value)
            solution.value.solutions = newValue.split('\n').map(line => line.trim());
    }
})

</script>

<style scoped>
.input-group .one-line span {
    font-size: 1.5rem;
    color: var(--color-error);
    cursor: pointer;
}
</style>