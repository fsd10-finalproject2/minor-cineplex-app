<script setup lang="ts">
import { ChevronDownIcon } from '@/assets/icons'

interface User {
  name: string
  avatar?: string
}

const { user, open, avatarSrc, mobile } = defineProps<{
  user: User
  open: boolean
  avatarSrc: string
  mobile?: boolean
}>()

defineEmits<{ (e: 'toggle'): void }>()
</script>

<template>
  <div class="flex gap-4 py-5 md:py-0">
    <div class="flex justify-center items-center gap-3">
      <img class="avatar rounded-full w-10 h-10 object-cover  " :src="avatarSrc" :alt="user.name" />
      <span class="user-name text-gray-400 style-body-2-regular">{{ user.name }}</span>
    </div>
    <button v-if="!mobile" class="text-gray-300 " @click="$emit('toggle')" :class="{ active: open }">
      <ChevronDownIcon />
    </button>
  </div>
</template>
