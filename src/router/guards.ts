import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const auth = useAuthStore()

    // route requires auth
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return next('/login')
    }

    // prevent logged-in user from going to login/register
    if (to.meta.guestOnly && auth.isLoggedIn) {
      return next('/')
    }

    next()
  })
}
