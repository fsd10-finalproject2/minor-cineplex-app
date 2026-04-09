<script lang="ts" setup>
import { ref, inject, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFormErrors } from '@/composables/useFormErrors'
import { ErrorHandlerKey, type ErrorHandlerReturn } from '@/composables/useErrorHandler'

import BaseInput from '@/components/ui/BaseInput/BaseInput.vue'
import BaseButton from '@/components/ui/CustomButton.vue'
import CustomButton from '@/components/ui/CustomButton.vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const name = ref('')

const errorHandler = inject<ErrorHandlerReturn | null>(ErrorHandlerKey, null)
const form = useFormErrors()


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


let emailTimer: ReturnType<typeof setTimeout> | null = null


// validation logic
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

// async email validation
async function validateEmailAsync(emailValue: string) {
  if (!emailValue) return

  checking.value.email = true

  try {
    const res = await fetch(`/auth/check-email?email=${emailValue}`)
    const data = await res.json()

    if (data.exists) {
      asyncErrors.value.email = 'Email already exists'
    } else {
      asyncErrors.value.email = null
    }
  } catch {
    asyncErrors.value.email = null
  } finally {
    checking.value.email = false
  }
}


// blur handler
function onBlur(field: 'name' | 'email' | 'password') {
  touched.value[field] = true

  const value = field === 'name' ? name.value : field === 'email' ? email.value : password.value

  localErrors.value[field] = validateField(field, value)
}


// realtime validation
watch(name, (val) => {
  if (touched.value.name) {
    localErrors.value.name = validateField('name', val)
  }
})

watch(email, (val) => {
  if (touched.value.email) {
    localErrors.value.email = validateField('email', val)

    if (localErrors.value.email) {
      asyncErrors.value.email = null
      return
    }
    // debounce
    if (emailTimer) clearTimeout(emailTimer)

    emailTimer = setTimeout(() => {
      validateEmailAsync(val)
    }, 500)
  }
})

watch(password, (val) => {
  if (touched.value.password) {
    localErrors.value.password = validateField('password', val)
  }
})

// merge errors
function getError(field: 'name' | 'email' | 'password') {
  if (field === 'email') {
    return localErrors.value.email || asyncErrors.value.email || form.fieldError('email')
  }

  return localErrors.value[field] || form.fieldError(field)
}

// submit
const register = async () => {
  form.clear()
  touched.value = {
    name: true,
    email: true,
    password: true,
  }

  // local validation
  localErrors.value.name = validateField('name', name.value)
  localErrors.value.email = validateField('email', email.value)
  localErrors.value.password = validateField('password', password.value)

  const hasLocalError = Object.values(localErrors.value).some(Boolean)

  if (hasLocalError || checking.value.email) return

  try {
    await auth.register({
      email: email.value,
      password: password.value,
      name: name.value,
    })

    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/login')
  } catch (err) {
    form.setFromResponse(err)

    if (!form.hasErrors.value) {
      errorHandler?.push(err)
    }
  }
}
</script>

<template>
  <div class="w-full max-w-95 flex flex-col gap-10">
    <!-- Title -->
    <div class="text-center style-headline-2">
      <h1 class="text-white">Register</h1>
    </div>

    <!-- Form -->
    <div class="flex flex-col gap-6">
      <!-- Name -->
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

      <!-- Email -->
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

      <!-- Password -->
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

    <!-- Global fallback -->
    <p v-if="form.globalError" class="text-red-400 text-sm text-center -mt-4">
      {{ form.globalError }}
    </p>

    <!-- Submit -->
    <BaseButton
      label="Register"
      variant="primary"
      :disabled="auth.loading || checking.email"
      class="w-full py-3"
      @click="register"
    />

    <!-- Redirect -->
    <span class="style-body-2-regular text-gray-300 flex justify-center items-center gap-1.5">
      Already have an account?
      <CustomButton variant="ghost" label="Login" @click="router.push('/login')" />
    </span>
  </div>
</template>
