<template>
    <h3>{{ selectedProblemId === "" ? "Create a Problem" : "Edit a Problem" }}</h3>
    <ProblemForm />
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue';
import ProblemForm from '../components/ProblemForm.vue';


let selectedProblemId = inject<Ref<String>>("selectedProblemId")
</script>

<style></style>