<script setup lang="ts">
import { ref } from 'vue'

import { UserIcon } from '@/assets/icons'
import ProfileWrapper from '@/components/ui/ProfileWrapper.vue'
import { useToast } from '@/composables/useToast'

const { addToast } = useToast()

// Dummy user state
const name = ref('Bruce Wayne')
const email = ref('iambatman@gmail.com')


const handleUpload = () => {
  console.log('Upload profile picture...')
}

const handleSave = () => {
  addToast({
    title: 'Saved profile',
    description: 'Your profile has been successfully updated',
    variant: 'success',
  })
  console.log('Saving profile...', { name: name.value, email: email.value })
}
</script>

<template>
  <ProfileWrapper 
    title="Profile" 
    description="Keep your personal details private. Information you add here is visible to anyone who can view your profile"
  >
    <!-- Avatar Upload Section -->
    <div class="flex items-center gap-4 py-2">
      <div 
        class="w-24 h-24 rounded-full bg-[#30364d] flex items-center justify-center border border-white/10 cursor-pointer hover:bg-[#3b4361] transition-colors overflow-hidden"
        @click="handleUpload"
      >
        <UserIcon class="w-10 h-10 text-gray-400" />
      </div>
      <button 
        @click="handleUpload"
        class="text-sm font-bold text-white underline underline-offset-4 hover:text-blue-400 transition-colors"
      >
        Upload
      </button>
    </div>

    <!-- Form Section -->
    <div class="flex flex-col gap-5 mt-2">
      <!-- Name Field -->
      <div class="flex flex-col gap-2">
        <label for="name" class="text-gray-400 text-xs font-semibold uppercase tracking-wider">Name</label>
        <input 
          id="name"
          v-model="name"
          type="text"
          class="bg-[#1c2237] border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
          placeholder="Your name"
        >
      </div>

      <!-- Email Field -->
      <div class="flex flex-col gap-2">
        <label for="email" class="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email</label>
        <input 
          id="email"
          v-model="email"
          type="email"
          class="bg-[#1c2237] border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all opacity-80"
          placeholder="Your email"
          disabled
        >
      </div>

      <!-- Save Button -->
      <div class="pt-4">
        <button 
          @click="handleSave"
          class="px-10 py-2.5 rounded border border-white/20 text-white font-bold hover:bg-white/5 hover:border-white/40 transition-all"
        >
          Save
        </button>
      </div>
    </div>
  </ProfileWrapper>
</template>

<style scoped>
.profile-container {
  /* Scrollbar removal for cleaner nav */
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
