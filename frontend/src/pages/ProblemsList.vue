<template>
    <div v-for="problem in problems" :key="problem._id">
        <Problem :problem="problem" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Problem from '../components/Problem.vue';
import { getProblemsAPI } from '../helpers/problems.api';
import { type IProblem } from '../types/problem';

const problems = ref<IProblem[]>([])

onMounted(async () => {
    problems.value = await getProblemsAPI()
})
</script>

<style></style>