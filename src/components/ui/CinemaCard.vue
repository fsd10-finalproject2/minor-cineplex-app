<script setup lang="ts">
import { PinIcon } from '@/assets/icons'

defineProps<{
  name: string
  address: string
  distance?: string
}>()
</script>

<template>
  <div class="cinema-card flex items-center w-full max-w-[590px] min-h-[90px] p-3 md:p-4 rounded bg-gray-0 border border-[#21263F] gap-3 md:gap-4 transition-all hover:bg-gray-100/5 cursor-pointer">
    <!-- Icon Container -->
    <div class="w-12 h-12 rounded-full bg-gray-100/10 flex items-center justify-center shrink-0">
      <PinIcon class="size-6 text-blue-100" />
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-1 overflow-hidden">
      <h3 class="name-text truncate">
        {{ name }}
      </h3>
      
      <div class="flex items-center gap-2 address-text truncate">
        <template v-if="distance">
          <span class="text-white font-medium">{{ distance }}</span>
          <div class="w-px h-3 bg-gray-100/30"></div>
        </template>
        <p class="truncate opacity-70">{{ address }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap');

.cinema-card {
  font-family: 'Roboto Condensed', sans-serif;
}

.name-text {
  font-size: 24px;
  line-height: 30px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.address-text {
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #B2B8CF; /* Gray-200 equivalent */
  margin: 0;
}
</style>
