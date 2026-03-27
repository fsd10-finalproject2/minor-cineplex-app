<script setup lang="ts">
import { computed } from 'vue'
import CaratButton from '@/components/ui/CaratButton.vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
}>()

const pages = computed(() => {
  const current = props.currentPage
  const total = props.totalPages
  const maxSlots = 9 // We will always show 9 slots for extra context

  if (total <= maxSlots) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const range: (number | string)[] = []

  // Near the start: 1 2 3 4 5 6 7 ... Total
  if (current <= 5) {
    for (let i = 1; i <= 7; i++) range.push(i)
    range.push('...')
    range.push(total)
  } 
  // Near the end: 1 ... 34 35 36 37 38 39 40
  else if (current >= total - 4) {
    range.push(1)
    range.push('...')
    for (let i = total - 6; i <= total; i++) range.push(i)
  } 
  // In the middle: 1 ... 8 9 10 11 12 ... 40
  else {
    range.push(1)
    range.push('...')
    range.push(current - 2)
    range.push(current - 1)
    range.push(current)
    range.push(current + 1)
    range.push(current + 2)
    range.push('...')
    range.push(total)
  }

  return range
})

const changePage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <div class="flex items-center gap-1.5 md:gap-4 select-none justify-center md:justify-start w-full max-w-full">
    <!-- Prev Arrow Wrapper (Locked Size) -->
    <div class="shrink-0 scale-90 md:scale-100">
      <CaratButton 
        direction="left" 
        :disabled="currentPage === 1" 
        @click="changePage(currentPage - 1)" 
      />
    </div>

    <!-- The Number Pill (Stable Width & Ultra-Responsive) -->
    <div class="flex items-center justify-center bg-gray-0 rounded-lg px-1 md:px-1.5 py-1 gap-0.5 md:gap-1.5 border border-gray-400/10 shadow-inner min-w-[240px] md:min-w-[540px]">
      <template v-for="(page, index) in pages" :key="index">
        <!-- Ellipsis -->
        <div
          v-if="page === '...'"
          class="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center text-gray-300 pointer-events-none text-[10px] md:text-base"
        >
          ...
        </div>

        <!-- Number Button -->
        <button
          v-else
          @click="changePage(page as number)"
          class="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-lg transition-all duration-300 style-body-4 md:style-body-2-medium cursor-pointer"
          :class="[
            currentPage === page
              ? 'bg-gray-100 text-white scale-110 shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-100/10',
            // Mobile: Hide slots 2, 3, 5, 6 to keep it centered and slim
            (index === 2 || index === 3 || index === 5 || index === 6) ? 'hidden sm:flex' : 'flex'
          ]"
        >
          {{ page }}
        </button>
      </template>
    </div>

    <!-- Next Arrow Wrapper (Locked Size) -->
    <div class="shrink-0 scale-90 md:scale-100">
      <CaratButton 
        direction="right" 
        :disabled="currentPage === totalPages" 
        @click="changePage(currentPage + 1)" 
      />
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles are managed via utility classes */
</style>
