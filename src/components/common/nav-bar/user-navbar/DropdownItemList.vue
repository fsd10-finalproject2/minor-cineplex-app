<template>
  <div class="flex flex-col justify-center items-start md:gap-4 gap-6">
    <DropdownItem @click="$emit('navigate', 'booking-history')">
      <template #icon><NoteBookIcon /></template>
      Booking history
    </DropdownItem>

    <DropdownItem @click="$emit('navigate', 'my-coupons')">
      <template #icon><TicketIcon /></template>
      My coupons
    </DropdownItem>

    <DropdownItem @click="$emit('navigate', 'profile')">
      <template #icon><UserIcon /></template>
      Profile
    </DropdownItem>

    <DropdownItem @click="$emit('navigate', 'reset-password')">
      <template #icon><RefreshIcon /></template>
      Reset password
    </DropdownItem>

    <div class="border-b border-gray-200 w-full md:w-37.5 mx-auto" />

    <DropdownItem variant="logout" @click="$emit('logout')">
      <template #icon><SignOutIcon /></template>
      Log out
    </DropdownItem>
  </div>
</template>

<script setup lang="ts">
import DropdownItem from './DropdownItem.vue'
import type { Page } from '@/types/navbarMenu'
import { NoteBookIcon, TicketIcon, UserIcon, RefreshIcon, SignOutIcon } from '@/assets/icons'

defineEmits<{
  (e: 'navigate', page: Page): void
  (e: 'logout'): void
}>()
</script>
