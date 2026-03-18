import { createWebHistory, createRouter } from 'vue-router'

import Landing from '../pages/Landing.vue'
import CreateProblem from '../pages/CreateProblem.vue'
import TagsManagement from '../pages/TagsManagement.vue'

const routes = [
  { path: '/', component: Landing },
  { path: '/problem', component: CreateProblem },
  { path: '/tags', component: TagsManagement },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
