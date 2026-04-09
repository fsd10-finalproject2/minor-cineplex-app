import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/services/api/auth.api'
import { useToast } from '@/composables/useToast'
import { supabase } from '@/lib/supabase'
import type { LoginRequest, RegisterRequest } from '@/types/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const { addToast } = useToast()


  const user = ref<{ userId: string; email: string; name: string } | null>(null)
  const isLoggedIn = computed(() => !!user.value)
  const error = ref<string | null>(null)
  const loading = ref(false)
  const forgotLoading = ref(false)
  const resetLoading = ref(false)

  async function login(data: LoginRequest) {
    loading.value = true
    error.value = null
    try {
      await authApi.login(data)
      await me()
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterRequest) {
    loading.value = true
    error.value = null
    try {
      await authApi.register(data)
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await authApi.logout()
    user.value = null
  }

  async function forgotPassword(email: string) {
    if (!email) {
      addToast({
        title: 'Email required',
        description: 'Please enter your email first',
        variant: 'error',
        position: 'top-right',
      })
      return
    }

    forgotLoading.value = true
    try {
      await authApi.forgotPassword({ email })
      addToast({
        title: 'Email sent!',
        description: 'Check your inbox for the reset link',
        variant: 'success',
        position: 'top-right',
      })
    } catch (e) {
      addToast({
        title: 'Failed to send email',
        description: (e as Error).message || 'Something went wrong',
        variant: 'error',
        position: 'top-right',
      })
    } finally {
      forgotLoading.value = false
    }
  }

  async function resetPasswordFromEmail(newPassword: string) {
    resetLoading.value = true
    try {
      const { error: supabaseError } = await supabase.auth.updateUser({ password: newPassword })
      if (supabaseError) throw new Error(supabaseError.message)

      addToast({
        title: 'Password updated!',
        description: 'You can now log in with your new password',
        variant: 'success',
        position: 'top-right',
      })

      router.push('/login')
    } catch (e) {
      addToast({
        title: 'Failed to reset password',
        description: (e as Error).message || 'Something went wrong',
        variant: 'error',
        position: 'top-right',
      })
    } finally {
      resetLoading.value = false
    }
  }

  async function me() {
    try {
      const res = await authApi.me()
      user.value = { userId: res.id, email: res.email, name: res.name ?? '' }
    } catch {
      user.value = null
    }
  }

  return {
    user,
    isLoggedIn,
    error,
    loading,
    login,
    register,
    logout,
    me,
    forgotLoading,
    forgotPassword,
    resetLoading,
    resetPasswordFromEmail,
  }
})
