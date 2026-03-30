<script setup lang="ts">
import { useRouter } from 'vue-router'
import DropdownItem from './DropdownItem.vue'
import { SignOutIcon } from '@/assets/icons'
import { menuItems } from '@/config/menuItems'

const router = useRouter()

defineEmits<{
  (e: 'logout'): void
}>()
</script>

<template>
  <div class="flex flex-col justify-center items-start md:gap-4 gap-6">
    <DropdownItem v-for="item in menuItems" :key="item.id" @click="router.push(item.to)">
      <template #icon><component :is="item.icon" /></template>
      {{ item.label }}
    </DropdownItem>

    <div class="border-b border-gray-200 w-full md:w-37.5 mx-auto" />

    <DropdownItem variant="logout" @click="$emit('logout')">
      <template #icon><SignOutIcon /></template>
      Log out
    </DropdownItem>
  </div>
</template>
