<template>
    <div class="problem-form">
        <div v-if="Object.keys(formErrors).length > 0" class="errors">
            <p v-for="(message, key) in formErrors" :key="key">
                {{ message }}
            </p>
        </div>
        <div class="form">
            <div class="title-row">
                <Input name="No." v-model.number="problem.problemNo" placeholder="Q#" type="number"
                    :hasError="!!formErrors.problemNo" underline />

                <Input name="Problem Name" v-model="problem.name" placeholder="Problem name"
                    :hasError="!!formErrors.name" underline />
            </div>

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
                <Input name="Recurrence Relation" v-model="recurrenceRelation" placeholder="Recurrence Relation" />
                <Input name="Base Case" v-model="baseCase" placeholder="Base Case" />
            </div>

            <TextArea name="Points To Remember" v-model="problem.pointsToRemember" placeholder="Multiple line points"
                underline />

            <div class="checkbox-group">
                <input type="checkbox" id="attempt-today" :checked="isAttemptedToday" @change="toggleTodayAttempt" />
                <label for="attempt-today" :class="{ 'text-muted': isAttemptedToday }">
                    {{ isAttemptedToday ? 'Added to attempts' : 'Attempted Today' }}
                </label>
            </div>

            <button @click="handleSubmit">Submit</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router';
import TagsSelector from './TagsSelector.vue';
import Input from './Input.vue';
import TextArea from './TextArea.vue';
import { getTodayDate } from '../helpers/date';
import { validateForm } from '../helpers/form';
import { createProblemAPI, editProblemAPI } from '../helpers/problems.api';
import type { ICreateProblem } from '../types/problem';

const router = useRouter()

const props = defineProps<{
    problem: ICreateProblem,
    isEditing: boolean
}>()

const emit = defineEmits(['update:problem']);

const problem = computed({
    get: () => props.problem,
    set: (value) => emit('update:problem', value)
});

const formErrors = ref<Record<string, string>>({})

// Computed prop for dp recurrence relation
const recurrenceRelation = computed({
    get: () => problem.value.dpPoints?.solutions[0] || "",
    set: (val) => {
        if (problem.value.dpPoints) problem.value.dpPoints.solutions[0] = val;
    }
});

// Computed prop for dp base case
const baseCase = computed({
    get: () => problem.value.dpPoints?.solutions[1] || "",
    set: (val) => {
        if (problem.value.dpPoints) problem.value.dpPoints.solutions[1] = val;
    }
});

// Computed prop to check if problem is attempted today
const isAttemptedToday = computed(() => {
    const todayPrefix = getTodayDate().split(' ')[0];
    return problem.value.datesAttempted?.some(d => d.startsWith(todayPrefix));
});

// Add and remove solution text areas
const addSolution = (): void => {
    problem.value.solutions.push({ solutions: [""] });
};

const removeSolution = (index: number): void => {
    problem.value.solutions.splice(index, 1);
};

// Function to add today to attempted dates
const toggleTodayAttempt = () => {
    const fullTimestamp = getTodayDate();
    const todayPrefix = fullTimestamp.split(' ')[0];

    if (isAttemptedToday.value) {
        problem.value.datesAttempted = problem.value.datesAttempted?.filter(
            d => !d.startsWith(todayPrefix)
        );
    } else {
        problem.value.datesAttempted?.push(fullTimestamp);
    }
};

// Handle submit
const handleSubmit = async () => {
    const { isValid, errors, sanitizedData } = validateForm(problem.value);

    if (!isValid) {
        formErrors.value = errors;
        return;
    }

    formErrors.value = {};

    if (props.isEditing) {
        await editProblemAPI(problem.value._id ?? '', sanitizedData)
    } else {
        await createProblemAPI(sanitizedData);
    }

    router.push({ name: 'problems' });
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

.form .title-row {
    display: flex;
    gap: 10px;
}

.form .title-row .input-group:first-of-type {
    width: 50px;
}

.form .title-row .input-group:nth-of-type(2) {
    flex: 1;
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