<template>
    <div>
        <span v-for="tag in tags" :key="tag" class="tag-item">
            <input type="checkbox" :id="tag" :value="tag" v-model="model" />
            <label :for="tag">{{ tag }}</label>
        </span>
    </div>
</template>

<script setup lang="ts">
import { tags } from '../data/tags'

const model = defineModel<string[]>();
</script>

<style></style>