<script setup lang="ts">
import { onMounted, provide, ref } from 'vue';
import { RouterView } from 'vue-router';
import MainTemplate from './templates/main.vue';
import './styles.css'
import { getTagsAPI } from './helpers/tags.api';
import { TagKey } from './helpers/keys';
import type { ITag } from './types/tags';

const originalTags = ref<ITag[]>([])
provide(TagKey, originalTags)

onMounted(async () => {
  originalTags.value = await getTagsAPI()
})

</script>

<template>
  <MainTemplate>
    <RouterView />
  </MainTemplate>
</template>
