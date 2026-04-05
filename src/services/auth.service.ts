import { ref } from 'vue'
import { authApi } from '@/services/api/auth.api'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth'

const currentUser = ref<{ userId: string; email: string } | null>(null)

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
    currentUser.value = { userId: res.userId, email: res.email }
    return res
  },

  async logout(): Promise<void> {
    await authApi.logout()
    currentUser.value = null
  },
}
