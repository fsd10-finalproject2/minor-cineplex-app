import { ref } from 'vue'
import { authApi } from '@/services/api/auth.api'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth'

const currentUser = ref<{ id: string; email: string; name: string; avatarUrl: string } | null>(null)

export const authService = {
  get isLoggedIn() {
    return !!currentUser.value
  },

  get user() {
    return currentUser.value
  },

  async register(data: RegisterRequest): Promise<string> {
    const res = await authApi.register(data)
    return res.message
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await authApi.login(data)
    currentUser.value = { id: res.userId, email: res.email, name: '', avatarUrl: '' }
    return res
  },

  async logout(): Promise<void> {
    await authApi.logout()
    currentUser.value = null
  },

  async me(): Promise<void> {
    try {
      const res = await authApi.me()
      console.log('me() success:', res)
      currentUser.value = { id: res.id, email: res.email, name: res.name, avatarUrl: res.avatarUrl }
    } catch {
      console.error('me() failed:')
      currentUser.value = null
    }
  },
}
