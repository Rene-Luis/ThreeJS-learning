import { createRouter, createWebHistory } from 'vue-router'

import Practice0 from '../views/Practice0.vue'
import Practice1 from '../views/Practice1.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'P0',
      component: Practice0
    },
    {
      path: '/P1',
      name: 'P1',
      component: Practice1
    },
  ],
})

export default router
