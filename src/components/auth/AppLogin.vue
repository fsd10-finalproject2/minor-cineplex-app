<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput/BaseInput.vue'
import BaseButton from '@/components/ui/CustomButton.vue'
import { Checkbox } from '@/components/ui/checkbox'
import CustomButton from '@/components/ui/CustomButton.vue'
import { useToast } from '@/composables/useToast'

const props = withDefaults(
  defineProps<{
    /** When true, do not navigate after login (e.g. embedded in a modal). */
    suppressRedirectAfterLogin?: boolean
  }>(),
  { suppressRedirectAfterLogin: false},
)

const router = useRouter()
const auth = useAuthStore()
const { addToast } = useToast()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

onMounted(() => {
  const savedEmail = localStorage.getItem('rememberedEmail')
  if (savedEmail) {
    email.value = savedEmail
    rememberMe.value = true
  }
})

const login = async () => {
  try {
    await auth.login({ email: email.value, password: password.value })

    if (rememberMe.value) {
      localStorage.setItem('rememberedEmail', email.value)
    } else {
      localStorage.removeItem('rememberedEmail')
    }

    // TODO: add logic to redirect to the page where the user was trying to access before login
    if (props.suppressRedirectAfterLogin) {
      return
    }

    const redirect = router.currentRoute.value.query.redirect as string | undefined

    router.push(redirect ? { path: redirect } : '/')
  } catch {
    addToast({
      title: "Your password is incorrect or this email doesn't exist",
      description: 'Please try another password or email',
      variant: 'error',
    })
  }
}
</script>

<template>
  <div class="w-full max-w-95 flex flex-col gap-10">
    <div class="text-center style-headline-2">
      <h1 class="text-white">Login</h1>
    </div>

    <div class="flex flex-col gap-6">
      <BaseInput
        v-model="email"
        label="Email"
        placeholder="Email"
        type="email"
        :show-left-icon="false"
        :state="auth.error ? 'error' : 'default'"
      />
      <BaseInput
        v-model="password"
        label="Password"
        placeholder="Password"
        type="password"
        :show-left-icon="false"
        :show-right-icon="false"
        :state="auth.error ? 'error' : 'default'"
        @keyup.enter="login"
      />
    </div>

    <div class="flex justify-between items-center">
      <Checkbox v-model="rememberMe" label="Remember" />
      <CustomButton
        variant="ghost"
        label="Forget password?"
        :disabled="auth.forgotLoading"
        @click="router.push('/forgot-password')"
      />
    </div>

    <BaseButton
      label="Login"
      variant="primary"
      :disabled="auth.loading"
      class="w-full py-3"
      @click="login"
    />

    <span class="style-body-2-regular text-gray-300 flex justify-center items-center gap-1.5">
      Don't have any account?
      <CustomButton variant="ghost" label="Register" @click="router.push('/register')" />
    </span>
  </div>
</template>
