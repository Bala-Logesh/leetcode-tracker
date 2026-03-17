<template>
    <label :for="name">{{ name }}</label>
    <input type="text" :name="name" v-model="model" :placeholder="placeholder">
</template>

<script setup lang="ts">
defineProps<{ placeholder: string, name: string }>()

const model = defineModel<any>()
</script>

<style></style>