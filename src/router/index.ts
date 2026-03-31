//wait for auth page

import { createRouter, createWebHistory } from 'vue-router'

// layouts
import MainLayout from '@/layouts/MainLayout.vue'
//import AuthLayout from '@/layouts/AuthLayout.vue'
import UserProfileLayout from '@/layouts/UserProfileLayout.vue'

import type { Page } from '@/types/navbarMenu'

// pages
// import HomePage from '@/views/HomePage.vue'
// import LoginPage from '@/views/LoginPage.vue'
// import RegisterPage from '@/views/RegisterPage.vue'
import DesignSystem from '@/views/DesignSystem.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          component: DesignSystem,
          meta: { requiresAuth: true },
        },
      ],
    },
    // {
    //   path: '/',
    //   component: AuthLayout,
    //   children: [
    //     {
    //       path: 'login',
    //       component: LoginPage,
    //       meta: { guestOnly: true },
    //     },
    //     {
    //       path: 'register',
    //       component: RegisterPage,
    //       meta: { guestOnly: true },
    //     },
    //   ],
    // },
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

export default router
