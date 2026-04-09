import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupGuards(router: Router) {
  router.beforeEach((to) => {
    const auth = useAuthStore()

    console.log('guard fired', {
      path: to.fullPath,
      requiresAuth: to.meta.requiresAuth,
      isLoggedIn: auth.isLoggedIn,
      user: auth.user,
    })

    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    if (to.meta.guestOnly && auth.isLoggedIn) {
      return { path: '/' }
    }
  })
}
