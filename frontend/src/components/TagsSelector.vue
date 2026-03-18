<template>
    <div>
        <label for="tag" class="tag underline">Tags</label>
        <div class="tags" :class="{ 'error': hasError }">
            <span v-for="tag in tagObjects" :key="tag._id" class="tag-item">
                <input type="checkbox" :name="tag.name" :value="tag._id" v-model="model" />
                <label :for="tag.name">{{ tag.name }}</label>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { tagObjects } from '../data/tags'
import type { ICreateTag } from '../types/tags';

defineProps<{ hasError?: boolean }>()
const model = defineModel<ICreateTag[]>();
</script>

<style scoped>
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