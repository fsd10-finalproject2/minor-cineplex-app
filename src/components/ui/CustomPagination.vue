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

  if (total <= 6) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const rangeSet = new Set<number>()
  rangeSet.add(1)
  rangeSet.add(total)

  // Show 2 neighbors on each side for that "symmetrical" Vuesax look
  for (let i = current - 2; i <= current + 2; i++) {
    if (i >= 1 && i <= total) rangeSet.add(i)
  }

  const sortedRange = Array.from(rangeSet).sort((a, b) => a - b)
  const rangeWithEllipsis: (number | string)[] = []

  for (let i = 0; i < sortedRange.length; i++) {
    const page = sortedRange[i]
    if (page === undefined) continue
    rangeWithEllipsis.push(page)
    const nextLocalPage = sortedRange[i + 1]
    if (nextLocalPage !== undefined && nextLocalPage - page > 1) {
      rangeWithEllipsis.push('...')
    }
  }

  return rangeWithEllipsis
})

const changePage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <div class="flex items-center gap-2 md:gap-4 select-none">
    <div class="scale-90 md:scale-100">
      <CaratButton
        direction="left"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="bg-gray-0 hover:bg-gray-100/20"
      />
    </div>

    <div class="flex items-center bg-gray-0 rounded-full px-1.5 py-1 gap-0.5 md:gap-1.5 border border-gray-400/10 shadow-inner">
      <template v-for="(page, index) in pages" :key="index">
        <!-- Ellipsis -->
        <div
          v-if="page === '...'"
          class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-300 pointer-events-none text-xs md:text-base px-1"
        >
          ...
        </div>

        <!-- Number Button -->
        <button
          v-else
          @click="changePage(page as number)"
          class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-300 style-body-3 md:style-body-2-medium cursor-pointer"
          :class="[
            currentPage === page
              ? 'bg-gray-100 text-white scale-110 shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-100/10',
            // Hide +/- 2 neighbors on mobile to keep the pill compact
            (page === currentPage - 2 || page === currentPage + 2) ? 'hidden sm:flex' : 'flex'
          ]"
        >
          {{ page }}
        </button>
      </template>
    </div>

    <div class="scale-90 md:scale-100">
      <CaratButton
        direction="right"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="bg-gray-0 hover:bg-gray-100/20"
      />
    </div>
  </div>
</template>

<style scoped>
/* Standard styles are managed via utility classes */
</style>
