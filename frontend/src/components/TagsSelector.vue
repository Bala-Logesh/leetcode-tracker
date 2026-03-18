<template>
    <div>
        <label for="tag" class="tag underline">Tags</label>
        <div class="tags" :class="{ 'error': hasError }">
            <span v-for="tag in originalTags" :key="tag._id" class="tag-item">
                <input type="checkbox" :name="tag.name" :value="tag._id" v-model="model" />
                <label :for="tag.name">{{ tag.name }}</label>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import type { ITag } from '../types/tags';
import { TagKey } from '../helpers/keys';

defineProps<{ hasError?: boolean }>()
const model = defineModel<ITag[]>();

const originalTags = inject(TagKey, ref([]))
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