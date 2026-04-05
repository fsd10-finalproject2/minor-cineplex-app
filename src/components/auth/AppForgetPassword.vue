<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput/BaseInput.vue'
import BaseButton from '@/components/ui/CustomButton.vue'

const auth = useAuthStore()

const email = ref('')

const handleForgotPassword = async () => {
  await auth.forgotPassword(email.value)
}
</script>

<template>
  <div class="w-full max-w-95 flex flex-col gap-10 justify-center ">
    <div class="text-center style-headline-2">
      <h1 class="text-white">Forget password</h1>
    </div>

    <div class="flex flex-col gap-6">
      <BaseInput
        v-model="email"
        label="Email"
        placeholder="Email"
        type="email"
        :show-left-icon="false"
        @keyup.enter="handleForgotPassword"
      />
    </div>

    <BaseButton
      label="Send reset link"
      variant="primary"
      :disabled="auth.forgotLoading"
      class="w-full py-3"
      @click="handleForgotPassword"
    />
  </div>
</template>
