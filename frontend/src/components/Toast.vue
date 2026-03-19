<template>
    <div class="toast" :class="{ 'show': toastStore.isVisible }">
        <p class="close" @click="toastStore.isVisible = false">&times;</p>
        <ul>
            <li v-for="msg in toastStore.messages" :key="msg">{{ msg }}</li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { toastStore } from '../helpers/toast.store';
</script>

<style scoped>
.toast {
    position: fixed;
    top: 20px;
    right: -500px;
    padding: 10px 20px 20px;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0px 0px 5px #888888;
    width: 500px;
    transition: right 250ms ease-in-out;
}

.toast.show {
    right: 20px;
}

.toast .close {
    text-align: right;
    font-size: 1.5rem;
    cursor: pointer;
}

.toast ul {
    padding-left: 1.5rem;
}

@media (max-width: 500px) {
    .toast {
        width: 90%;
        top: 80px;
    }
}
</style>