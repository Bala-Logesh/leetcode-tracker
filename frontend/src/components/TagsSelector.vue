<template>
    <div>
        <label for="tag" class="tag underline">Tags</label>
        <div class="tags" :class="{ 'error': hasError }">
            <span v-for="tag in tags" :key="tag" class="tag-item">
                <input type="checkbox" :id="tag" :value="tag" v-model="model" />
                <label :for="tag">{{ tag }}</label>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { tags } from '../data/tags'
defineProps<{ hasError?: boolean }>()
const model = defineModel<string[]>();
</script>

<style>
.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    margin-top: 10px;
    border-radius: 6px;
    border: 1px solid transparent;
}

.tags.error {
    border-color: var(--color-error);
}

.tags input {
    margin-right: 6px;
}
</style>