<template>
    <label :for="name">{{ name }}</label>
    <input type="text" :name="name" v-model="model" :placeholder="placeholder" :class="{ 'error': hasError }">
</template>

<script setup lang="ts">
defineProps<{ placeholder: string, name: string, hasError?: boolean }>()

const model = defineModel<any>()
</script>

<style>
input.error {
    border-color: #ff4d4f !important;
}
</style>