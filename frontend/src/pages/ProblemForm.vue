<template>
    <h3>{{ isEditing ? "Edit a Problem" : "Create a Problem" }}</h3>
    <ProblemFormComp :problem="activeProblem" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import ProblemFormComp from '../components/ProblemFormComp.vue';
import { DEFAULT_CREATE_PROBLEM, type ICreateProblem } from '../types/problem';
import { problems } from '../data/problem';
import { useRoute } from 'vue-router';

const route = useRoute()
const problemIdFromUrl = route.params.id as string

const activeProblem = ref<ICreateProblem>({ ...DEFAULT_CREATE_PROBLEM })
const isEditing = computed(() => !!route.params.id)

onMounted(() => {
    if (problemIdFromUrl) {
        const found = problems.find(p => p._id === problemIdFromUrl)
        if (found) {
            activeProblem.value = { ...found }
        }
    }
})

watch(() => route.params.id, (newId) => {
    if (newId) {
        const found = problems.find(p => p._id === newId)
        if (found) activeProblem.value = { ...found }
    } else {
        activeProblem.value = { ...DEFAULT_CREATE_PROBLEM }
    }
})
</script>

<style></style>