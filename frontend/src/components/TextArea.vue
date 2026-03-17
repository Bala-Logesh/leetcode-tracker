<template>
    <label :for="name">{{ name }}</label>
    <textarea :name="name" v-model="textData" :placeholder="placeholder" rows="3" />
    <button @click="removeSolution(index)">Remove</button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineProps<{
    placeholder: string,
    name: string,
    index: number,
    removeSolution: (index: number) => void
}>()

const solutions = defineModel<any>()

const textData = computed({
    get() {
        return solutions.value[0]?.join('\n') || '';
    },
    set(newValue: string) {
        const lines = newValue.split('\n').map(line => line.trim());
        solutions.value = [lines];
    }
})

</script>

<style></style>