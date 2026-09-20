import { createRouter, createWebHistory } from 'vue-router'

import Practice0 from '../views/Practice0.vue'
import Practice1 from '../views/Practice1.vue'
import Practice2 from '../views/Practice2.vue'
import Transformations from '../views/Transformations.vue'

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
    {
      path: '/P2',
      name: 'P2',
      component: Practice2
    },

    {
      path: '/Transformations',
      name: 'Transformations',
      component: Transformations
    },

  ],
})

export default router
