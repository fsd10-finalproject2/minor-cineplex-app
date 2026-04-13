<script setup lang="ts">
import { PinIcon } from '@/assets/icons'

defineProps<{
  name: string
  address: string
  distance?: string
}>()
</script>

<template>
  <button type="button" class="flex items-center w-full max-w-[590px] min-h-[90px] p-3 md:p-4 rounded border border-gray-100 gap-3 md:gap-4 transition-all hover:bg-blue-100/10 text-left">
    <!-- Icon Container -->
    <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
      <PinIcon class="size-8 text-blue-100" />
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-1 overflow-hidden py-1">
      <h3 class="style-headline-3 text-white line-clamp-2 leading-tight">
        {{ name }}
      </h3>

      <div class="flex flex-col sm:flex-row sm:items-center gap-x-2 style-body-2-regular text-gray-400">
        <div v-if="distance" class="flex items-center gap-2">
          <span class="text-white shrink-0">{{ distance }}</span>
          <div class="hidden sm:block w-0.5 h-4 bg-gray-300"></div>
        </div>
        <p class="line-clamp-2 opacity-70">{{ address }}</p>
      </div>
    </div>
  </button>
</template>

<style scoped>
/* Component styles are now managed via global utility classes in main.css */
</style>
