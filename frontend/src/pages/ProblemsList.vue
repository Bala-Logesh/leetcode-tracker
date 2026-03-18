<template>
    <div class="search">
        <input type="text" class="searchbar" v-model="searchText" placeholder="Search for problems">
        <select name="tag" id="tag" v-model="searchTag">
            <option value="all">All Tags</option>
            <option v-for="tag in tags" :value="tag._id" :key="tag._id">{{ tag.name }}</option>
        </select>
        <button @click="handleSearch">Search</button>
    </div>
    <div v-for="problem in problems" :key="problem._id">
        <Problem :problem="problem" />
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import Problem from '../components/Problem.vue';
import { getProblemsAPI } from '../helpers/problems.api';
import { type IProblem } from '../types/problem';
import { TagKey } from '../helpers/keys';

const problems = ref<IProblem[]>([])
const tags = inject(TagKey, ref([]))

const searchText = ref<string>("")
const searchTag = ref<string>("all")

onMounted(async () => {
    problems.value = await getProblemsAPI()
})

const handleSearch = async () => {
    const query = searchText.value.trim();
    problems.value = await getProblemsAPI(query, searchTag.value);
}
</script>

<style scoped>
.search {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
    padding-left: 2px;
}

.search input {
    flex: 1;
}

.search select {
    min-height: 34px;
}
</style>