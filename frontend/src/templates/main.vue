<template>
    <div class="container">
        <header>
            <nav>
                <h3>
                    <RouterLink to="/">LC Tracker</RouterLink>
                </h3>
                <ul>
                    <li>
                        <RouterLink to="/problem-form" :class="{ active: routeName === 'problem-form' }">Problem Form
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/tags" :class="{ active: routeName === 'tags' }">Tags
                        </RouterLink>
                    </li>
                </ul>
            </nav>
        </header>
        <div class="main">
            <div class="content">
                <slot></slot>
            </div>
        </div>
        <footer>
            <p>Made with ❤️</p>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const routeName = computed((): string => route.path.slice(1))
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

header {
    background-color: #FEFFFF;
}

nav {
    display: flex;
    align-items: center;
    padding: 10px 20px;
}

nav h3 {
    flex: 1;
}

nav>ul {
    display: flex;
    flex-direction: row;
    gap: 20px;
    list-style: none;
}

nav ul li a {
    cursor: pointer;
    text-underline-offset: 5px;
}

nav ul li a.active,
nav ul li a:hover {
    text-decoration: underline;
}

.main {
    flex: 1;
    padding: 20px 40px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.main .content {
    overflow: scroll;
}

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
}

@media (max-width: 500px) {
    nav {
        flex-direction: column;
        gap: 10px;
        padding: 20px;
    }

    .main {
        padding: 20px;
    }
}
</style>