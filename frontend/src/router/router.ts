import { createWebHistory, createRouter } from 'vue-router'

import Landing from '../pages/Landing.vue'
import TagsManagement from '../pages/TagsManagement.vue'
import ProblemsList from '../pages/ProblemsList.vue'
import ProblemForm from '../pages/ProblemForm.vue'

const routes = [
  { path: '/', name: 'home', component: Landing },
  { path: '/problems', name: 'problems', component: ProblemsList },
  { path: '/problem-form/:id?', name: 'problem-form', component: ProblemForm },
  { path: '/tags', name: 'tags', component: TagsManagement },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
