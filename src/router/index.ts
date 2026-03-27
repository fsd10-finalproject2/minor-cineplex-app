import { createRouter, createWebHistory } from 'vue-router'
import DesignSystem from '@/views/DesignSystem.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/design-system',
      name: 'design-system',
      component: DesignSystem,
    },
  ],
})

export default router
