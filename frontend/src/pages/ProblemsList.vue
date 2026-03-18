<template>
    <div v-for="problem in problems" :key="problem._id">
        <Problem :problem="problem" />
    </div>
</template>

<script setup lang="ts">
import Problem from '../components/Problem.vue';
import { problems } from '../data/problem'
</script>

<style></style>