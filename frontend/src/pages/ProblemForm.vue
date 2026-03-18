<template>
    <h3>{{ isEditing ? "Edit a Problem" : "Create a Problem" }}</h3>
    <ProblemFormComp :problem="activeProblem" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProblemFormComp from '../components/ProblemFormComp.vue';
import { getProblemAPIById } from '../helpers/problems.api';
import { DEFAULT_CREATE_PROBLEM, type ICreateProblem } from '../types/problem';

const route = useRoute()
const problemIdFromUrl = route.params.id as string

const activeProblem = ref<ICreateProblem>({ ...DEFAULT_CREATE_PROBLEM })
const isEditing = computed(() => !!route.params.id)

onMounted(async () => {
    if (problemIdFromUrl) {
        const problemToEdit = await getProblemAPIById(problemIdFromUrl)
        if (problemToEdit) {
            activeProblem.value = { ...problemToEdit }
        }
    }
})

watch(() => route.params.id, async (newId) => {
    if (newId) {
        const problemToEdit = await getProblemAPIById(problemIdFromUrl)
        if (problemToEdit) {
            activeProblem.value = { ...problemToEdit }
        }
    } else {
        activeProblem.value = { ...DEFAULT_CREATE_PROBLEM }
    }
})
</script>

<style></style>