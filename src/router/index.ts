import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: '/', redirect: '/home' },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/goal', name: 'goal', component: () => import('../views/goal/GoalManage.vue') },
    { path: '/type', name: 'type', component: () => import('../views/type/TypeManage.vue') },
  ],
})

export default router
