<script lang="ts" setup>
import { ref, inject, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFormErrors } from '@/composables/useFormErrors'
import { ErrorHandlerKey, type ErrorHandlerReturn } from '@/composables/useErrorHandler'
import { authApi } from '@/services/api/auth.api'

import BaseInput from '@/components/ui/BaseInput/BaseInput.vue'
import CustomButton from '@/components/ui/CustomButton.vue'
import { DoneIcon } from '@/assets/icons'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const name = ref('')

const errorHandler = inject<ErrorHandlerReturn | null>(ErrorHandlerKey, null)
const form = useFormErrors()

const isSuccess = ref(false)

const touched = ref({
  name: false,
  email: false,
  password: false,
})

const localErrors = ref<Record<'name' | 'email' | 'password', string | null>>({
  name: null,
  email: null,
  password: null,
})

const asyncErrors = ref<{ email: string | null }>({
  email: null,
})

const checking = ref({
  email: false,
})

const emailVerified = ref(false)

const fieldRefs = { name, email, password }

let emailTimer: ReturnType<typeof setTimeout> | null = null
let emailAbortController: AbortController | null = null

onUnmounted(() => {
  if (emailTimer) clearTimeout(emailTimer)
  if (emailAbortController) emailAbortController.abort()
})

function validateField(field: 'name' | 'email' | 'password', value: string): string | null {
  switch (field) {
    case 'name':
      if (!value) return 'Name is required'
      if (value.length < 2) return 'Name must be at least 2 characters'
      return null
    case 'email':
      if (!value) return 'Email is required'
      if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format'
      return null
    case 'password':
      if (!value) return 'Password is required'
      if (value.length < 8) return 'Password must be at least 8 characters'
      return null
  }
}

async function validateEmailAsync(emailValue: string) {
  console.log('[validateEmailAsync] called with:', emailValue)
  if (!emailValue) {
    console.log('[validateEmailAsync] empty email, returning early')
    return
  }

  if (emailAbortController) {
    console.log('[validateEmailAsync] aborting previous request')
    emailAbortController.abort()
  }
  emailAbortController = new AbortController()

  checking.value.email = true
  emailVerified.value = false
  console.log('[validateEmailAsync] checking started, emailVerified=false')

  try {
    const data = await authApi.checkEmail(emailValue)
    console.log('[validateEmailAsync] API response:', data)
    asyncErrors.value.email = data.exists ? 'Email already exists' : null
    emailVerified.value = true
    console.log(
      '[validateEmailAsync] done. asyncErrors.email:',
      asyncErrors.value.email,
      '| emailVerified:',
      emailVerified.value,
    )
  } catch (err) {
    console.error('[validateEmailAsync] error caught:', err)
    if ((err as Error).name !== 'AbortError') {
      asyncErrors.value.email = null
      emailVerified.value = true
      console.log('[validateEmailAsync] non-abort error, emailVerified=true')
    } else {
      console.log('[validateEmailAsync] aborted, emailVerified stays false')
    }
  } finally {
    checking.value.email = false
    console.log('[validateEmailAsync] finally: checking.email=false')
  }
}

function onBlur(field: 'name' | 'email' | 'password') {
  touched.value[field] = true
  const value = fieldRefs[field].value
  localErrors.value[field] = validateField(field, value)
}

watch(name, (val) => {
  if (touched.value.name) {
    localErrors.value.name = validateField('name', val)
  }
})

watch(email, (val) => {
  console.log('[watch email] changed to:', val)
  emailVerified.value = false
  asyncErrors.value.email = null

  if (touched.value.email) {
    localErrors.value.email = validateField('email', val)

    if (localErrors.value.email) {
      asyncErrors.value.email = null
      return
    }

    if (emailTimer) clearTimeout(emailTimer)
    emailTimer = setTimeout(() => {
      console.log('[watch email] debounce fired, calling validateEmailAsync')
      validateEmailAsync(val)
    }, 500)
  }
})

watch(password, (val) => {
  if (touched.value.password) {
    localErrors.value.password = validateField('password', val)
  }
})

function getError(field: 'name' | 'email' | 'password') {
  if (field === 'email') {
    return localErrors.value.email || asyncErrors.value.email || form.fieldError('email')
  }
  return localErrors.value[field] || form.fieldError(field)
}

const register = async () => {
  console.log('[register] called')
  touched.value = { name: true, email: true, password: true }

  localErrors.value.name = validateField('name', name.value)
  localErrors.value.email = validateField('email', email.value)
  localErrors.value.password = validateField('password', password.value)

  console.log('[register] localErrors:', JSON.stringify(localErrors.value))

  const hasLocalError = Object.values(localErrors.value).some(Boolean)
  if (hasLocalError) {
    console.log('[register] has local errors, returning early')
    return
  }

  console.log(
    '[register] emailVerified:',
    emailVerified.value,
    '| asyncErrors.email:',
    asyncErrors.value.email,
  )

  if (!emailVerified.value) {
    console.log('[register] email not verified yet, running validateEmailAsync now')
    if (emailTimer) {
      clearTimeout(emailTimer)
      emailTimer = null
    }
    await validateEmailAsync(email.value)
    console.log(
      '[register] after await validateEmailAsync — emailVerified:',
      emailVerified.value,
      '| asyncErrors.email:',
      asyncErrors.value.email,
    )
  }

  if (asyncErrors.value.email) {
    console.log('[register] async email error exists, returning:', asyncErrors.value.email)
    return
  }

  console.log('[register] all validations passed, clearing form errors and calling auth.register')
  form.clear()

  try {
    const result = await auth.register({
      email: email.value,
      password: password.value,
      name: name.value,
    })
    console.log('[register] auth.register success, result:', result)
    console.log('[register] setting isSuccess = true')
    isSuccess.value = true
    console.log('[register] isSuccess is now:', isSuccess.value)
  } catch (err) {
    console.error('[register] auth.register threw error:', err)
    form.setFromResponse(err)
    console.log('[register] form.hasErrors:', form.hasErrors.value)

    if (!form.hasErrors.value) {
      errorHandler?.push(err)
    }
  }
}
</script>

<template>
  <div v-if="isSuccess" class="w-full max-w-95 flex flex-col gap-10 text-center">
    <div class="flex flex-col items-center gap-6">
      <div class="text-white bg-green-50 rounded-full p-5"><DoneIcon :size="60" stroke-width="3" /></div>
      <h1 class="text-white style-headline-2">Registration success</h1>
      <p class="style-body-2-regular text-gray-300">Your account has been successfully created!</p>
    </div>
    <CustomButton
      variant="primary"
      label="Go to Login"
      class="w-full py-3"
      @click="router.push('/login')"
    />
  </div>

  <div v-else class="w-full max-w-95 flex flex-col gap-10">
    <div class="text-center style-headline-2">
      <h1 class="text-white">Register</h1>
    </div>

    <div class="flex flex-col gap-6">
      <BaseInput
        v-model="name"
        label="Name"
        placeholder="Full name"
        type="text"
        :show-left-icon="false"
        @blur="onBlur('name')"
        :state="getError('name') ? 'error' : 'default'"
        :help-text="getError('name') || undefined"
      />

      <BaseInput
        v-model="email"
        label="Email"
        placeholder="Email"
        type="email"
        :show-left-icon="false"
        @blur="onBlur('email')"
        :state="getError('email') ? 'error' : 'default'"
        :help-text="checking.email ? 'Checking email...' : getError('email') || undefined"
      />

      <BaseInput
        v-model="password"
        label="Password"
        placeholder="Password"
        type="password"
        :show-left-icon="false"
        :show-right-icon="false"
        @blur="onBlur('password')"
        :state="getError('password') ? 'error' : 'default'"
        :help-text="getError('password') || undefined"
        @keyup.enter="register"
      />
    </div>

    <p v-if="form.globalError" class="text-red-400 text-sm text-center -mt-4">
      {{ form.globalError }}
    </p>

    <CustomButton
      label="Register"
      variant="primary"
      :disabled="auth.loading || checking.email"
      class="w-full py-3"
      @click="register"
    />

    <span class="style-body-2-regular text-gray-300 flex justify-center items-center gap-1.5">
      Already have an account?
      <CustomButton variant="ghost" label="Login" @click="router.push('/login')" />
    </span>
  </div>
</template>
