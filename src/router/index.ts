//wait for auth page

import { createRouter, createWebHistory } from 'vue-router'

// layouts
import MainLayout from '@/layouts/MainLayout.vue'
//import AuthLayout from '@/layouts/AuthLayout.vue'

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
  ],
})

export default router
