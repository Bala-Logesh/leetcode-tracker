<template>
    <Input name="Problem Title" v-model="problemTitle" placeholder="Q#. Problem name" />

    <TagsSelector v-model="problem.tags" />

    <TextArea v-for="(_, index) of problem.solutions" name="Solution" v-model="problem.solutions[index]"
        placeholder="Multiple line solutions" :index="index" :removeSolution="removeSolution" />

    <button @click="addSolution">Add New Solution</button>

    <div>
        <p>DP Points</p>
        <Input name="Recurrence Relation" :model-value="dpPoints[0]" @update:model-value="val => updateDPPoints(0, val)"
            placeholder="Recurrence Relation" />
        <Input name="Base Case" :model-value="dpPoints[1]" @update:model-value="val => updateDPPoints(1, val)"
            placeholder="Base Case" />
    </div>

    <TextArea name="Points To Remember" v-model="problem.pointsToRemember" placeholder="Multiple line points" />
    
    {{ problem }}
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DEFAULT_CREATE_PROBLEM, type ICreateProblem } from '../types/problem';
import TagsSelector from './TagsSelector.vue';
import Input from './Input.vue';
import TextArea from './TextArea.vue';

const problem = ref<ICreateProblem>(DEFAULT_CREATE_PROBLEM)

const addSolution = (): void => {
    problem.value.solutions.push([]);
};

const removeSolution = (index: number): void => {
    problem.value.solutions.splice(index, 1);
};

const dpPoints = computed({
    get() {
        const points = problem.value.dpPoints || [];
        return [points[0] || "", points[1] || ""];
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
</script>

<style></style>