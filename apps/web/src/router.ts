import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from './store/useAuthStore'
import Home from './views/Home.vue'
import Callback from './views/Callback.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/Dashboard.vue'),
    meta: { requiresAuth: true }
  }
]

export const router = createRouter({
  routes,
  history: createWebHashHistory()
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore() 
  
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    // If not authenticated, redirect to login
    if (!authStore.isAuthenticated) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})
