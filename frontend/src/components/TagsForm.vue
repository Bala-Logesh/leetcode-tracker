<template>
    <div class="tags-container">
        <div v-if="tagsList.length > 0" class="tags-list">
            <div v-for="(tag, index) in tagsList" :key="tag._id" class="tag-item">
                <input type="text" v-model="tag.name" placeholder="Tag name"
                    :class="{ 'newTag': tag.isNew, 'deleteTag': tag.isDeleted, 'editedTag': isEdited(tag) }" />
                <span v-if="!tag.isDeleted" @click="removeTag(index)">&times;</span>
                <span v-if="tag.isDeleted" class="undo" @click="undoRemoveTag(index)">&#9100;</span>
            </div>
        </div>

        <p v-if="tagsList.length === 0">No Tags are present</p>

        <div class="button-group">
            <button :disabled="isSaving" @click="addTagInput" :class="{ 'disabled': isSaving }">+ New Tag</button>
            <button :disabled="isSaving || !isEditing" :class="{ 'disabled': isSaving || !isEditing }"
                @click="saveChanges" class="save-btn">Save All Changes</button>
        </div>

        <div class="error" v-if="hasErrors">
            <div v-for="(errorList, category) in errors" :key="category">
                <ul v-if="errorList.length">
                    <li v-for="(message, index) in errorList" :key="index">
                        <strong>{{ category.toUpperCase() }}:</strong> {{ message }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import { type IModifyTag, type IEditTag } from '../types/tags';
import { createTagsAPI, deleteTagsAPI, editTagsAPI, getTagsAPI } from '../helpers/tags.api';
import { TagKey } from '../helpers/keys';

const tagsList = ref<IModifyTag[]>([]);
const isSaving = ref<boolean>(false)
const errors = ref<Record<'new' | 'edit' | 'delete', string[]>>({
    new: [],
    edit: [],
    delete: []
});

const originalTags = inject(TagKey, ref([]))

onMounted(async () => {
    const tags = await getTagsAPI()
    originalTags.value = tags
    tagsList.value = tags.map(t => ({ ...t, isNew: false, isDelete: false }))
})

const tagNames = computed(() => {
    return originalTags.value.map(t => t.name)
})

const hasErrors = computed(() => {
    return Object.values(errors.value).some(arr => arr.length > 0);
});

const isEdited = (tag: IModifyTag) => {
    if (tag.isNew) return false;

    const original = originalTags.value.find(orig => orig._id === tag._id);
    return original ? tag.name !== original.name : false;
};

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
    errors.value['new'] = []

    for (const tag of tags) {
        if (tagNames.value.includes(tag.name)) {
            errors.value['new'].push(`${tag.name} already exists`)
        }
    }

    return tags.map(t => t.name)
}
);

const editedTagsToUpdate = computed<IEditTag[]>(() => {
    const tags = tagsList.value.filter(isEdited)
    errors.value['edit'] = []

    for (const tag of tags) {
        if (tagNames.value.includes(tag.name)) {
            errors.value['edit'].push(`${tag.name} already exists`)
        }
    }

    return tags.map(t => ({ _id: t._id ?? "", name: t.name }))
}
);

const tagsToDelete = computed<string[]>(() => {
    const tags = tagsList.value.filter(t => !t.isNew && t.isDeleted)
    return tags.map(t => t._id ?? "")
}
);

const isEditing = computed<boolean>(() =>
    newTagsToCreate.value.length > 0 || editedTagsToUpdate.value.length > 0 || tagsToDelete.value.length > 0)

const saveChanges = async () => {
    try {
        isSaving.value = true
        await Promise.all([
            newTagsToCreate.value.length && createTagsAPI(newTagsToCreate.value),
            editedTagsToUpdate.value.length && editTagsAPI(editedTagsToUpdate.value),
            tagsToDelete.value.length && deleteTagsAPI(tagsToDelete.value)
        ]);

        const refreshedTags = await getTagsAPI();

        originalTags.value = refreshedTags;
        tagsList.value = refreshedTags.map(t => ({ ...t, isNew: false, isDelete: false }));
    } catch (error) {
        console.log(error);
    } finally {
        isSaving.value = false;
    }
};
</script>

<style scoped>
.tags-container {
    margin: 40px auto;
    max-width: 600px;
}

.tags-container .error {
    padding: 20px;
    color: var(--color-error);
    border-radius: 6px;
}

.tags-container .error ul {
    padding-left: 10px;
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
    border: 1px solid darkgreen;
    background-color: #98fb9833;
}

.tag-item input.editedTag {
    border: 1px solid #eee302;
    background-color: #eee30233;
}

.tag-item.error,
.tag-item input.deleteTag {
    border: 1px solid var(--color-error);
    background-color: #b1202224
}

.tag-item.error,
.tag-item input.editTag {
    border: 1px solid var(--color-error);
    background-color: #b1202224
}

.tag-item span {
    width: 30px;
    font-size: 1.5rem;
    color: var(--color-error);
    cursor: pointer;
    text-align: right;
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