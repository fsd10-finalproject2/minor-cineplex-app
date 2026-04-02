<script setup lang="ts">
import { ref } from 'vue'
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
  <div class="reset-password-container w-full max-w-[374px] mx-auto pt-10 px-4 pb-10 flex flex-col gap-10 overflow-y-auto">
    
    <!-- Header -->
    <div class="flex flex-col gap-2">
      <h1 class="text-white font-bold tracking-tight text-[36px] leading-[44px] font-['Roboto_Condensed']">Reset password</h1>
    </div>

    <!-- Form Section -->
    <div class="flex flex-col gap-6">
      
      <!-- New Password -->
      <div class="flex flex-col gap-2">
        <label for="new-password" class="text-gray-400 text-xs font-semibold uppercase tracking-wider">New password</label>
        <input 
          id="new-password"
          v-model="newPassword"
          type="password"
          class="bg-[#1c2237] border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
          placeholder="New password"
        >
      </div>

      <!-- Confirm Password -->
      <div class="flex flex-col gap-2">
        <label for="confirm-password" class="text-gray-400 text-xs font-semibold uppercase tracking-wider">Confirm password</label>
        <input 
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          class="bg-[#1c2237] border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
          placeholder="Confirm new password"
        >
      </div>

      <!-- Action Button -->
      <div class="pt-2">
        <button 
          @click="handleReset"
          class="px-10 py-2.5 rounded border border-white/20 text-white font-bold hover:bg-white/5 hover:border-white/40 transition-all"
        >
          Reset password
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.reset-password-container {
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
