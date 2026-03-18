<template>
    <div class="tags-container">
        <div class="tags-list">
            <div v-for="(tag, index) in tagsList" :key="tag._id" class="tag-item">
                <input type="text" v-model="tag.name" placeholder="Tag name"
                    :class="{ 'newTag': tag.isNew, 'deleteTag': tag.isDeleted }" />
                <span v-if="!tag.isDeleted" @click="removeTag(index)">&times;</span>
                <span v-if="tag.isDeleted" class="undo" @click="undoRemoveTag(index)">&#9100;</span>
            </div>
        </div>

        <div class="button-group">
            <button @click="addTagInput">+ New Tag</button>
            <button @click="saveChanges" class="save-btn">Save All Changes</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { type ITag, type IDisplayTag, type IEditTag } from '../types/tags';
import { createTagsAPI, deleteTagsAPI, editTagsAPI, getTagsAPI } from '../helpers/tags.api';

const tagsList = ref<IDisplayTag[]>([]);
const originalTags = ref<ITag[]>([])

onMounted(async () => {
    const tags = await getTagsAPI()
    originalTags.value = tags
    tagsList.value = tags.map(t => ({ ...t, isNew: false, isDelete: false }))
})

const addTagInput = () => {
    tagsList.value.push({ name: "", isNew: true, isDeleted: false });
};

const removeTag = (index: number) => {
    tagsList.value[index].isDeleted = true
}

const undoRemoveTag = (index: number) => {
    tagsList.value[index].isDeleted = false
}

const newTagsToCreate = computed<string[]>(() => {
    const tags = tagsList.value.filter(t => t.isNew && t.name.trim() !== "")
    return tags.map(t => t.name)
}
);

const editedTagsToUpdate = computed<IEditTag[]>(() => {
    const tags = tagsList.value.filter(t => {
        if (t.isNew) return false;
        const original = originalTags.value.find(orig => orig._id === t._id);
        return original && t.name !== original.name;
    })

    return tags.map(t => ({ _id: t._id ?? "", name: t.name }))
}
);

const tagsToDelete = computed<string[]>(() => {
    const tags = tagsList.value.filter(t => !t.isNew && t.isDeleted)
    return tags.map(t => t._id ?? "")
}
);

const saveChanges = async () => {
    console.log("Creating these:", newTagsToCreate.value);
    if (newTagsToCreate.value.length > 0) {
        await createTagsAPI(newTagsToCreate.value)
    }

    console.log("Updating these:", editedTagsToUpdate.value);
    if (editedTagsToUpdate.value.length > 0) {
        await editTagsAPI(editedTagsToUpdate.value)
    }

    console.log("Deleting these:", tagsToDelete.value);
    await deleteTagsAPI(tagsToDelete.value)
};
</script>

<style scoped>
.tags-container {
    margin: 40px auto;
    max-width: 600px;
}

.tags-list {
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    margin-top: 10px;
}

.tag-item {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    min-width: 100%;
}

.tag-item input {
    flex: 1;
    min-width: 200px;
}

.tag-item input.newTag {
    border-color: darkgreen;
}

.tag-item.error {
    border-color: var(--color-error);
}

.tag-item span {
    width: 30px;
    font-size: 1.5rem;
    color: var(--color-error);
    cursor: pointer;
}

.tag-item span.undo {
    color: darkgreen;
}

.button-group {
    display: flex;
    gap: 20px;
    margin: 40px auto;
    justify-content: center;
}

@media (max-width: 800px) {
    .tags-container {
        margin: 40px 20px;
        max-width: 100%;
    }
}
</style>