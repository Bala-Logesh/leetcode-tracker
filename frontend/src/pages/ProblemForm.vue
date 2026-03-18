<template>
    <h3>{{ isEditing ? "Edit a Problem" : "Create a Problem" }}</h3>
    <ProblemFormComp v-model:problem="activeProblem" isEditing />
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import ProblemFormComp from '../components/ProblemFormComp.vue';
import { getProblemAPIById } from '../helpers/problems.api';
import { getInitialProblemState } from '../types/problem';

const route = useRoute()

const activeProblem = ref(getInitialProblemState());
const isEditing = computed(() => !!route.params.id)

watchEffect(async () => {
    const id = route.params.id as string;

    if (id) {
        const problemToEdit = await getProblemAPIById(id);
        if (problemToEdit) {
            activeProblem.value = { ...problemToEdit };
        }
    } else {
        activeProblem.value = getInitialProblemState();
    }
});
</script>

<style></style>