<template>
    <div class="overlay" @click="negativeAction">
        <div class="popup" @click.stop>
            <h2 class="header">{{ title }}</h2>
            <p class="question">{{ question }}</p>
            <div class="button-group">
                <button class="error" @click="negativeAction">{{ buttons[0] }}</button>
                <button @click="positiveAction">{{ buttons[1] }}</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    question: string
    buttons: string[]
    positiveAction: any
    negativeAction: any
}>()
</script>

<style>
.overlay {
    position: absolute;
    inset: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.8);
}

.popup {
    width: 400px;
    min-height: max-content;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 30px;
    padding: 20px;
}

.overlay .popup .button-group {
    display: flex;
    gap: 20px;
    align-self: end;
}
</style>