<template>
    <div class="problem-form">
        <div v-if="Object.keys(formErrors).length > 0" class="errors">
            <p v-for="(message, key) in formErrors" :key="key">
                {{ message }}
            </p>
        </div>
        <div class="form">
            <Input name="Problem Title" v-model="problemTitle" placeholder="Q#. Problem name"
                :hasError="!!formErrors.name || !!formErrors.problemNo" underline />

            <TagsSelector v-model="problem.tags" :hasError="!!formErrors.tags" />

            <div>
                <div class="one-line">
                    <p class="underline">Solutions</p>
                    <button @click="addSolution">+ Solution</button>
                </div>
                <TextArea v-for="(_, index) of problem.solutions" name="Solution" v-model="problem.solutions[index]"
                    placeholder="Multiple line solutions" :index="index" :removeSolution="removeSolution"
                    :hasError="!!formErrors.solutions" />
            </div>

            <div>
                <p class="underline">DP Points</p>
                <Input name="Recurrence Relation" :model-value="dpPoints[0]"
                    @update:model-value="val => updateDPPoints(0, val)" placeholder="Recurrence Relation" />
                <Input name="Base Case" :model-value="dpPoints[1]" @update:model-value="val => updateDPPoints(1, val)"
                    placeholder="Base Case" />
            </div>

            <TextArea name="Points To Remember" v-model="problem.pointsToRemember" placeholder="Multiple line points"
                underline />

            <div class="checkbox-group">
                <input type="checkbox" id="attempt-today" :checked="markedAttempted !== ''"
                    @change="addTodayToAttemptedDates" />
                <label for="attempt-today" :class="{ 'text-muted': markedAttempted }">
                    {{ markedAttempted ? 'Added to attempts' : 'Attempted Today' }}
                </label>
            </div>

            <button @click="handleSubmit">Submit</button>
        </div>
    </div>
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
const markedAttempted = ref<string>("")

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
    if (markedAttempted.value) {
        problem.value.datesAttempted = problem.value.datesAttempted?.filter(
            d => d !== markedAttempted.value
        );
        markedAttempted.value = "";
        return;
    }

    const date = getTodayDate();
    markedAttempted.value = date;
    problem.value.datesAttempted?.push(date);
}

// Handle submit
const handleSubmit = () => {
    console.log(problem.value)
    const { isValid, errors, sanitizedData } = validateForm(problem.value)

    if (!isValid) {
        formErrors.value = errors
    } else {
        formErrors.value = {}
        console.log("sanitizedData", sanitizedData)
    }
}
</script>

<style scoped>
.problem-form {
    margin: 40px auto;
    max-width: 800px;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.errors {
    border: 1px solid var(--color-error);
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 6px;
    color: var(--color-error);
}

.form .checkbox-group input {
    margin-right: 6px;
}

@media (max-width: 800px) {
    .problem-form {
        margin: 40px 20px;
        max-width: 100%;
    }
}
</style>