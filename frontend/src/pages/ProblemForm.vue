<template>
    <div class="one-line">
        <h3>{{ isEditing ? "Edit a Problem" : "Create a Problem" }}</h3>
        <button v-if="isEditing" class="error" @click="confirmDelete">Delete Problem</button>
    </div>
    <ProblemFormComp v-model:problem="activeProblem" :isEditing="isEditing" />
    <Popup v-if="showPopup" title="Confirmation to delete" question="Do you want to delete this problem?"
        :buttons="['Cancel', 'Confirm']" :positiveAction="handleDelete" :negativeAction="closePopup" />
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProblemFormComp from '../components/ProblemFormComp.vue';
import { deleteProblemAPI, getProblemAPIById } from '../helpers/problems.api';
import { getInitialProblemState } from '../types/problem';
import Popup from '../components/Popup.vue';

const route = useRoute()
const router = useRouter()

const activeProblem = ref(getInitialProblemState());
const isEditing = computed(() => !!route.params.id)
const showPopup = ref<boolean>(false)

watchEffect(async () => {
    const id = route.params.id as string;

    if (id) {
        const problemToEdit = await getProblemAPIById(id);
        if (problemToEdit) {
            activeProblem.value = { ...problemToEdit };
        } else {
            router.push({ name: 'problems' });
        }
    } else {
        activeProblem.value = getInitialProblemState();
    }
});

const confirmDelete = () => {
    showPopup.value = true
}

const closePopup = () => {
    showPopup.value = false
}

const handleDelete = async () => {
    if (!isEditing.value) return

    showPopup.value = false

    const id = route.params.id as string;
    const deleted = await deleteProblemAPI(id)

    if (deleted) {
        router.push({ name: 'problems' });
    }
}
</script>

<style scoped>
.one-line {
    height: 50px;
}
</style>