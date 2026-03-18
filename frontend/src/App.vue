<script setup lang="ts">
import { RouterView } from 'vue-router';
import MainTemplate from './templates/main.vue';
import './styles.css'
import { provide, ref } from 'vue';

const selectedProblemId = ref<string>("")

provide("selectedProblemId", selectedProblemId)
</script>

<template>
  <MainTemplate>
    <RouterView />
  </MainTemplate>
</template>
