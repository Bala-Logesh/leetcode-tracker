<template>
    <div class="search">
        <input type="text" class="searchbar" v-model="searchText" placeholder="Search for problems">
        <select name="tag" id="tag" v-model="searchTag">
            <option value="all">All Tags</option>
            <option v-for="tag in tags" :value="tag._id" :key="tag._id">{{ tag.name }}</option>
        </select>
        <button @click="handleSearch()">Search</button>
    </div>
    <div v-for="problem in problems" :key="problem._id">
        <Problem :problem="problem" />
    </div>
    <div class="pagination">
        <button :disabled="!pagination.hasPrevPage" @click="goToPrev"
            :class="{ 'disabled': !pagination.hasPrevPage }">Prev</button>
        <div class="options">
            <div class="page">
                <input type="text" v-model="pagination.page" placeholder="1">
                <p>/ {{ pagination.totalPages }}</p>
            </div>
            <div class="limit">
                <label for="limit">Limit</label>
                <input type="text" placeholder="10" v-model="pagination.limit">
            </div>
            <button @click="handleSearch()">Apply</button>
        </div>
        <button :disabled="!pagination.hasNextPage" :class="{ 'disabled': !pagination.hasNextPage }"
            @click="goToNext">Next</button>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import Problem from '../components/Problem.vue';
import { getProblemsAPI } from '../helpers/problems.api';
import { type IProblem } from '../types/problem';
import { TagKey } from '../helpers/keys';
import { DEFAULT_PAGINATION, type Pagination } from '../types/common';

const problems = ref<IProblem[]>([])
const tags = inject(TagKey, ref([]))

const pagination = ref<Pagination>(DEFAULT_PAGINATION)
const searchText = ref<string>("")
const searchTag = ref<string>("all")

onMounted(async () => {
    const { data, pagination: pag } = await getProblemsAPI()
    problems.value = data
    pagination.value = pag
    console.log(pagination.value)
})

const handleSearch = async (targetPage?: number) => {
    if (targetPage !== undefined) {
        pagination.value.page = targetPage;
    }

    const { data, pagination: pag } = await getProblemsAPI(
        searchText.value,
        searchTag.value,
        pagination.value.page,
        pagination.value.limit
    );

    problems.value = data;
    pagination.value = pag;
};

// Logic for the Prev/Next buttons
const goToPrev = () => {
    if (pagination.value.hasPrevPage) {
        handleSearch(pagination.value.page - 1);
    }
};

const goToNext = () => {
    if (pagination.value.hasNextPage) {
        handleSearch(pagination.value.page + 1);
    }
};

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

.pagination {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.pagination input {
    width: 50px;
}

.pagination .options {
    display: flex;
    gap: 20px;
}

.pagination .limit,
.pagination .page {
    display: flex;
    gap: 10px;
    align-items: center;
}
</style>