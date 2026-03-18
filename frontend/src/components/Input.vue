<template>
    <div class="input-group">
        <label :for="name" :class="{ 'underline': underline }">{{ name }}</label>
        <input type="text" :name="name" v-model="model" :placeholder="placeholder" :class="{ 'error': hasError }">
    </div>
</template>

<script setup lang="ts">
defineProps<{
    placeholder: string,
    name: string,
    hasError?: boolean,
    underline?: boolean
}>()

const model = defineModel<any>()
</script>

<style></style>