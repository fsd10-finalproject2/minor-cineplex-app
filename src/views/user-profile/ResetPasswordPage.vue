<script setup lang="ts">
import { ref } from 'vue'
import ProfileWrapper from '@/components/user-profile/ProfileWrapper.vue'
import BaseInput from '@/components/ui/BaseInput/BaseInput.vue'
import CustomButton from '@/components/ui/CustomButton.vue'
import { useToast } from '@/composables/useToast'

const { addToast } = useToast()

// Form state
const newPassword = ref('')
const confirmPassword = ref('')

const handleReset = () => {
  if (newPassword.value !== confirmPassword.value) {
    addToast({
      title: 'Passwords mismatch',
      description: 'The new password and confirmation must match',
      variant: 'error',
    })
    return
  }

  // TODO: Logic to update password in auth store / backend
  addToast({
    title: 'Password Updated',
    description: 'Your password has been successfully reset',
    variant: 'success',
  })
}
</script>

<template>
  <ProfileWrapper title="Reset password">
    <!-- Form Section -->
    <div class="flex flex-col gap-6">
      
      <!-- New Password -->
      <BaseInput 
        v-model="newPassword"
        label="New password"
        placeholder="New password"
        type="password"
        :show-left-icon="false"
        class="w-full md:w-[380px]"
      />

      <!-- Confirm Password -->
      <BaseInput 
        v-model="confirmPassword"
        label="Confirm password"
        placeholder="Confirm new password"
        type="password"
        :show-left-icon="false"
        class="w-full md:w-[380px]"
      />

      <!-- Action Button -->
      <div class="pt-4">
        <CustomButton 
          label="Reset password" 
          variant="secondary" 
          @click="handleReset"
          class="px-10 py-3" 
        />
      </div>
    </div>
  </ProfileWrapper>
</template>

<style scoped>
</style>
