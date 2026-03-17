<template>
    <label :for="name">{{ name }}</label>
    <textarea :name="name" v-model="textData" :placeholder="placeholder" rows="3" :class="{ 'error': hasError }" />
    <button v-if="index !== undefined && removeSolution" @click="removeSolution(index)">Remove</button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    placeholder: string,
    name: string,
    index?: number,
    removeSolution?: (index: number) => void
    hasError?: boolean
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
textarea.error {
    border-color: #ff4d4f !important;
}
</style>