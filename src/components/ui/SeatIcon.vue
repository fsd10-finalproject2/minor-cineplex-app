<script setup lang="ts">
import { computed } from 'vue'

export type SeatStatus = 'booked' | 'available' | 'selected' | 'reserved' | 'friend'

const props = defineProps<{
  status: SeatStatus
}>()

const statusConfig = computed(() => {
  switch (props.status) {
    case 'booked':
      return {
        bg: 'bg-[#3E455F]',
        stroke: 'stroke-[#6A718F]',
        iconColor: 'text-[#6A718F]',
        hasIcon: true,
        icon: 'x'
      }
    case 'available':
      return {
        bg: 'bg-[#7C9AFF]',
        stroke: 'stroke-[#AEC1FF]',
        hasIcon: false
      }
    case 'selected':
      return {
        bg: 'bg-[#407BFF]',
        stroke: 'stroke-white',
        strokeWidth: '2',
        hasBadge: true,
        hasIcon: false
      }
    case 'reserved':
      return {
        bg: 'bg-[#1D3D7C]',
        stroke: 'stroke-[#3F61A9]',
        iconColor: 'text-[#AEC1FF]',
        hasIcon: true,
        icon: 'hourglass'
      }
    case 'friend':
      return {
        bg: 'bg-[#00A251]',
        stroke: 'stroke-[#4ADE80]',
        iconColor: 'text-white',
        hasIcon: true,
        icon: 'star'
      }
    default:
      return { bg: 'bg-gray-400', stroke: 'stroke-gray-200', hasIcon: false }
  }
})
</script>

<template>
  <div 
    class="relative w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden transition-all duration-300"
    :class="[statusConfig.bg, status === 'selected' ? 'ring-2 ring-white ring-inset' : '']"
  >
    <!-- Seat Visual Silhouette -->
    <svg 
      viewBox="0 0 40 40" 
      class="absolute inset-0 w-full h-full fill-none pointer-events-none"
    >
      <path 
        d="M0 24H10C10 24 10 32 20 32C30 32 30 24 30 24H40" 
        :class="statusConfig.stroke" 
        stroke-width="1.5" 
        stroke-linecap="round"
      />
    </svg>

    <!-- Center Icon -->
    <div v-if="statusConfig.hasIcon" :class="statusConfig.iconColor" class="z-10">
      <!-- Booked X -->
      <svg v-if="statusConfig.icon === 'x'" viewBox="0 0 24 24" class="w-5 h-5 fill-none stroke-current" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      
      <!-- Reserved Hourglass -->
      <svg v-if="statusConfig.icon === 'hourglass'" viewBox="0 0 24 24" class="w-4 h-4 fill-none stroke-current" stroke-width="1.5">
        <path d="M12 7V12L14.5 13.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>

      <!-- Friend Star -->
      <svg v-if="statusConfig.icon === 'star'" viewBox="0 0 24 24" class="w-5 h-5 fill-none stroke-current" stroke-width="1.5">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- Selected Badge -->
    <div 
      v-if="statusConfig.hasBadge"
      class="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full translate-x-1 translate-y-1 flex items-center justify-center border-2 border-[#407BFF]"
    >
      <svg viewBox="0 0 24 24" class="w-3 h-3 fill-none stroke-[#407BFF]" stroke-width="4">
        <path d="M20 6L9 17L4 12" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles kept minimal - using Tailwind */
</style>
