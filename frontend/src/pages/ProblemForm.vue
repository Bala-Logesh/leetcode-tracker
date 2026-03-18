<template>
    <div class="one-line">
        <h3>{{ isEditing ? "Edit a Problem" : "Create a Problem" }}</h3>
        <button class="error" @click="handleDelete">Delete Problem</button>
    </div>
    <ProblemFormComp v-model:problem="activeProblem" isEditing />
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProblemFormComp from '../components/ProblemFormComp.vue';
import { deleteProblemAPI, getProblemAPIById } from '../helpers/problems.api';
import { getInitialProblemState } from '../types/problem';

const route = useRoute()
const router = useRouter()

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

const handleDelete = async () => {
    if (!isEditing.value) return

    const id = route.params.id as string;
    await deleteProblemAPI(id)

    router.push({ name: 'problems' });
}
</script>

<style scoped>
.one-line {
    height: 50px;
}
</style>