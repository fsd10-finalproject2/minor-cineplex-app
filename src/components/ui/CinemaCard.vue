<script setup lang="ts">
import { PinIcon } from '@/assets/icons'

defineProps<{
  name: string
  address: string
  distance?: string
}>()
</script>

<template>
  <div class="flex items-center w-full max-w-[590px] min-h-[90px] p-3 md:p-4 rounded border border-gray-100 gap-3 md:gap-4 transition-all hover:bg-blue-100/10 cursor-pointer">
    <!-- Icon Container -->
    <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
      <PinIcon class="size-6 text-blue-100" />
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-1 overflow-hidden">
      <h3 class="style-headline-3 text-white truncate">
        {{ name }}
      </h3>

      <div class="flex items-center gap-2 style-body-1-regular text-gray-400 truncate">
        <template v-if="distance">
          <span class="text-white font-medium">{{ distance }}</span>
          <div class="w-0.5 h-4 bg-gray-300"></div>
        </template>
        <p class="truncate opacity-70">{{ address }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Component styles are now managed via global utility classes in main.css */
</style>
