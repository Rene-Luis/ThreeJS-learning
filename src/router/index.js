import { createRouter, createWebHistory } from 'vue-router'

import Practice0 from '../views/Practice0.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'P0',
      component: Practice0
    },
  ],
})

export default router
