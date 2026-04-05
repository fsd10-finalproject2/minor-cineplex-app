import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// layouts
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import UserProfileLayout from '@/layouts/UserProfileLayout.vue'

import type { Page } from '@/types/navbarMenu'

// pages
import LoginPage from '@/views/auth/LoginPage.vue'
import RegisterPage from '@/views/auth/RegisterPage.vue'
import DesignSystem from '@/views/DesignSystem.vue'
// import SeatBookingView from '@/views/SeatBookingView.vue'
import CouponsPage from '@/views/CouponsPage.vue'
import LandingPage from '@/views/LandingPage.vue'
import ForgetPasswordPage from '@/views/auth/ForgetPasswordPage.vue'
import ResetPasswordPage from '@/views/user-profile/ResetPasswordPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          component: LandingPage,
          meta: { requiresAuth: false },
        },
        {
          path: 'design-system',
          component: DesignSystem,
        },
        {
          path: 'coupons',
          name: 'coupons',
          component: CouponsPage,
          meta: { requiresAuth: false },
        },
      ],
    },
    {
      path: '/',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          component: LoginPage,
          meta: { guestOnly: true },
        },
        {
          path: 'register',
          component: RegisterPage,
          meta: { guestOnly: true },
        },
        {
          path: 'forgot-password',
          component: ForgetPasswordPage,
          meta: { guestOnly: true },
        },
        {
          path: 'auth-reset-password',
          component: ResetPasswordPage,
        },
      ],
    },
    {
      path: '/account',
      redirect: '/account/booking-history',
      component: UserProfileLayout,
      children: [
        {
          path: 'booking-history',
          name: 'booking-history' satisfies Page,
          component: () => import('@/views/user-profile/BookingHistoryPage.vue'),
        },
        {
          path: 'my-coupons',
          name: 'my-coupons' satisfies Page,
          component: () => import('@/views/user-profile/MyCouponsPage.vue'),
        },
        {
          path: 'profile',
          name: 'profile' satisfies Page,
          component: () => import('@/views/user-profile/ProfilePage.vue'),
        },
        {
          path: 'reset-password',
          name: 'reset-password' satisfies Page,
          component: () => import('@/views/user-profile/ResetPasswordPage.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, _from) => {
  const auth = useAuthStore()

  // redirect to login if requires auth and not logged in
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  // redirect to home if already logged in and tries to access guest only pages
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { path: '/' }
  }
})

export default router
