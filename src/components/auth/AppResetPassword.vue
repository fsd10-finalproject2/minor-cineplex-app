<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput/BaseInput.vue'
import BaseButton from '@/components/ui/CustomButton.vue'
import { supabase } from '@/lib/supabase'

const auth = useAuthStore()

const newPassword = ref('')
const confirmPassword = ref('')
const ready = ref(false)
const passwordError = ref('')

onMounted(() => {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
      ready.value = true
    }
  })
})

const handleReset = async () => {
  passwordError.value = ''

  if (!newPassword.value || !confirmPassword.value) {
    passwordError.value = 'Please fill in all fields'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match'
    return
  }

  if (newPassword.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
    return
  }

  await auth.resetPasswordFromEmail(newPassword.value)
}
</script>

<template>
  <div class="w-full max-w-95 flex flex-col gap-10">
    <div class="text-center style-headline-2">
      <h1 class="text-white">Reset password</h1>
    </div>

    <!-- Verifying token -->
    <div v-if="!ready" class="text-center text-gray-300 style-body-2-regular">
      ⏳ Verifying link...
    </div>

    <!-- Reset Form -->
    <div v-else class="flex flex-col gap-10">
      <div class="flex flex-col gap-6">
        <BaseInput
          v-model="newPassword"
          label="New password"
          placeholder="New password"
          type="password"
          :show-left-icon="false"
          :show-right-icon="false"
          :state="passwordError ? 'error' : 'default'"
          @keyup.enter="handleReset"
        />
        <BaseInput
          v-model="confirmPassword"
          label="Confirm password"
          placeholder="Confirm new password"
          type="password"
          :show-left-icon="false"
          :show-right-icon="false"
          :state="passwordError ? 'error' : 'default'"
          :help-text="passwordError"
          @keyup.enter="handleReset"
        />
      </div>

      <BaseButton
        label="Reset password"
        variant="primary"
        :disabled="auth.resetLoading"
        class="w-full py-3"
        @click="handleReset"
      />
    </div>
  </div>
</template>
