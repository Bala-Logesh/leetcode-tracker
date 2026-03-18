<template>
    {{ formErrors }}
    <div class="form">
        <Input name="Problem Title" v-model="problemTitle" placeholder="Q#. Problem name"
            :hasError="!!formErrors.name || !!formErrors.problemNo" underline />

        <TagsSelector v-model="problem.tags" :hasError="!!formErrors.tags" />

        <p class="underline">Solutions</p>
        <TextArea v-for="(_, index) of problem.solutions" name="Solution" v-model="problem.solutions[index]"
            placeholder="Multiple line solutions" :index="index" :removeSolution="removeSolution"
            :hasError="!!formErrors.solutions" />

        <button @click="addSolution">Add New Solution</button>

        <div>
            <p class="underline">DP Points</p>
            <Input name="Recurrence Relation" :model-value="dpPoints[0]"
                @update:model-value="val => updateDPPoints(0, val)" placeholder="Recurrence Relation" />
            <Input name="Base Case" :model-value="dpPoints[1]" @update:model-value="val => updateDPPoints(1, val)"
                placeholder="Base Case" />
        </div>

        <TextArea name="Points To Remember" v-model="problem.pointsToRemember" placeholder="Multiple line points"
            underline />

        <button :disabled="markedAttempted" :class="{ 'disabled': markedAttempted }"
            @click="addTodayToAttemptedDates">Attempted Today</button>

        <button @click="handleSubmit">Submit</button>
    </div>
    {{ problem }}
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DEFAULT_CREATE_PROBLEM, type ICreateProblem } from '../types/problem';
import TagsSelector from './TagsSelector.vue';
import Input from './Input.vue';
import TextArea from './TextArea.vue';
import { getTodayDate } from '../helpers/date';
import { validateForm } from '../helpers/form';

const problem = ref<ICreateProblem>(DEFAULT_CREATE_PROBLEM)
const formErrors = ref<Record<string, string>>({})
const markedAttempted = ref<boolean>(false)

// Add and remove solution text areas
const addSolution = (): void => {
    problem.value.solutions.push([]);
};

const removeSolution = (index: number): void => {
    problem.value.solutions.splice(index, 1);
};

// Computed prop and update function for dp parts - recursive relation and base case
const dpPoints = computed({
    get() {
        const points = problem.value.dpPoints || [];
        return [points[0], points[1]];
    },
    set(newValue: string[]) {
        problem.value.dpPoints = [...newValue];
    }
})

const updateDPPoints = (index: number, val: string) => {
    const updated = [...dpPoints.value];
    updated[index] = val;
    dpPoints.value = updated;
};

// Computed prop to get problem number and title
const problemTitle = computed({
    get() {
        if (problem.value.problemNo !== 0)
            return `${problem.value.problemNo}. ${problem.value.name}`

        return ""
    },

    set(newTitle: string) {
        const parts = newTitle.split(". ")

        if (parts.length == 2) {
            problem.value.problemNo = parseInt(parts[0], 10)
            problem.value.name = parts[1]
        } else {
            problem.value.problemNo = 0
            problem.value.name = ""
        }
    }
})

// Function to add today to attempted dates
const addTodayToAttemptedDates = () => {
    markedAttempted.value = true
    problem.value.datesAttempted?.push(getTodayDate());
}

// Handle submit
const handleSubmit = () => {
    const { isValid, errors, sanitizedData } = validateForm(problem.value)

    if (!isValid) {
        formErrors.value = errors
    } else {
        console.log("sanitizedData", sanitizedData)
    }
}
</script>

<style>
.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 800px;
    margin: 20px;
}
</style>