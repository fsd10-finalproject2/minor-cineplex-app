import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null as null | { name: string; avatar: string },
  }),

  actions: {
    login() {
      this.isLoggedIn = true
      this.user = {
        name: 'Bruce Wayne',
        avatar: 'https://i.pravatar.cc/40?img=8',
      }
    },
    logout() {
      this.isLoggedIn = false
      this.user = null
    },
  },
})