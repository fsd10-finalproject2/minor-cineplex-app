<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@/assets/icons'

defineProps<{
  direction: 'left' | 'right'
  disabled?: boolean
}>()
</script>

<template>
  <button
    :disabled="disabled"
    @click="$emit('click', $event)"
    class="p-2 w-10 h-10 rounded-full transition-all duration-200 text-gray-200 enabled:hover:text-white enabled:hover:bg-gray-100/10 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0"
  >
    <ChevronLeftIcon v-if="direction === 'left'" class="size-6" />
    <ChevronRightIcon v-if="direction === 'right'" class="size-6" />
  </button>
</template>
