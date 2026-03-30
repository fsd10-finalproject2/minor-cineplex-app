<template>
  <div v-show="open" class="flex flex-col gap-6 pt-4">
    <DropdownItemList @navigate="$emit('navigate', $event)" @logout="$emit('logout')" />
  </div>
</template>

<script setup lang="ts">
import DropdownItemList from './DropdownItemList.vue'
import type { User, Page } from '@/types/navbarMenu'

defineProps<{
  user: User
  open?: boolean
  avatarSrc: string
}>()

defineEmits<{
  (e: 'navigate', page: Page): void
  (e: 'logout'): void
}>()
</script>
