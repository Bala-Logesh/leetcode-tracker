<template>
    <div class="problem">
        <div class="one-line">
            <h2 class="underline">Q{{ problem.problemNo }}. {{ problem.name }}</h2>
            <button @click="setEditProblem">Edit problem</button>
        </div>
        <p class="tags">{{ tags }}</p>
        <div class="section solution" v-for="solution in problem.solutions" :key="solution._id">
            <ul>
                <li v-for="sol in solution.solutions" :key="sol">{{ sol }}</li>
            </ul>
        </div>
        <div v-if="problem?.dpPoints?.solutions.length === 2" class="section dp">
            <h3>DP Points</h3>
            <h4>Recurrence Relation</h4>
            <p>{{ problem.dpPoints.solutions[0] }}</p>
            <h4>Base Case</h4>
            <p>{{ problem.dpPoints.solutions[1] }}</p>
        </div>
        <div v-if="problem?.pointsToRemember?.solutions" class="section">
            <h3>Points to remember</h3>
            <ul>
                <li v-for="sol in problem.pointsToRemember.solutions" :key="sol">{{ sol }}</li>
            </ul>
        </div>
        <div v-if="problem?.datesAttempted" class="section">
            <h3>Attempted Dates</h3>
            <ul>
                <li v-for="sol in problem.datesAttempted" :key="sol">{{ sol }}</li>
            </ul>
        </div>

        <button :disabled="markedAttempted" @click="handleMarkAttempted" :class="{ 'disabled': markedAttempted }">{{
            markedAttempted ? 'Attempted today' : 'Mark attempted today' }}</button>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { getTodayDate } from '../helpers/date';
import type { IProblem } from '../types/problem';

const router = useRouter()
const props = defineProps<{ problem: IProblem }>()
let selectedProblemId = inject<Ref<String>>("selectedProblemId")

const markedAttempted = ref<boolean>(false)

const tags = props.problem.tags.map(t => t.name).join(", ")

const setEditProblem = () => {
    if (!selectedProblemId) return

    selectedProblemId.value = props.problem._id
    router.push('/problem-form')
}

const handleMarkAttempted = () => {
    if (markedAttempted.value) return

    markedAttempted.value = true
    const date = getTodayDate()
    props.problem.datesAttempted?.push(date)
    console.log("Marked Attempted", date)
}
</script>

<style scoped>
.problem {
    padding-bottom: 20px;
    border-bottom: 1px solid black;
}

.problem .one-line {
    margin-top: 20px;
    height: auto;
}

.problem ul {
    padding-left: 1.5rem;
    list-style-position: outside;
    line-height: 1.5;
}

.section,
.problem h2,
.problem h4 {
    margin-bottom: 10px;
}

.problem h2 {
    text-underline-offset: 5px;
    line-height: 2.2rem;
}

.solution {
    margin-bottom: 20px;
}

.solution:last-of-type {
    margin-bottom: 10px;
}

.problem h3 {
    margin-top: 20px;
}

.problem .tags {
    margin-bottom: 10px;
    color: var(--color-error);
}

.section.dp h4 {
    margin-top: 10px;
    font-style: italic;
}

.section.dp h4:first-of-type {
    margin-top: 0;
}

.section.dp p {
    margin-left: 1.5rem;
}

@media (max-width: 500px) {
    .problem .one-line {
        flex-direction: column;
        align-items: start;
        gap: 6px;
        margin-bottom: 20px;
    }
}
</style>