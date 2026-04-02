<script setup lang="ts">
import { ref } from 'vue'

import { UserIcon } from '@/assets/icons'
import { useToast } from '@/composables/useToast'
import ProfileWrapper from '@/components/user-profile/ProfileWrapper.vue'
import BaseInput from '@/components/ui/BaseInput/BaseInput.vue'
import CustomButton from '@/components/ui/CustomButton.vue'

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
    :description="'Keep your personal details private.\nInformation you add here is visible to anyone who can view your profile'"
  >
    <!-- Avatar Upload Section -->
    <div class="flex items-center gap-4 py-2">
      <div
        class="size-30 rounded-full bg-[#30364d] flex items-center justify-center border border-white/10 cursor-pointer hover:bg-[#3b4361] transition-colors overflow-hidden"
        @click="handleUpload"
      >
        <UserIcon class="w-10 h-10 text-gray-400" />
      </div>
      <CustomButton
        variant="ghost"
        @click="handleUpload"
        class="self-end"
      >
        Upload
      </CustomButton>
    </div>

    <!-- Form Section -->
    <div class="flex flex-col gap-5 mt-2">
      <!-- Name Field -->
      <BaseInput
        v-model="name"
        label="Name"
        placeholder="Your name"
        :show-left-icon="false"
        class="w-full md:w-[380px]"
      />

      <!-- Email Field -->
      <BaseInput
        v-model="email"
        label="Email"
        placeholder="Your email"
        state="disable"
        :show-left-icon="false"
        class="w-full md:w-[380px]"
      />

      <!-- Save Button -->
      <div class="pt-4">
        <CustomButton label="Save" variant="secondary" @click="handleSave" class="px-10 py-3" />
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
