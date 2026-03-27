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
  
  if (total <= 4) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const range: (number | string)[] = []
  range.push(current)

  if (current + 1 < total - 1) {
    range.push(current + 1)
    range.push('...')
  }

  if (!range.includes(total - 1)) range.push(total - 1)
  if (!range.includes(total)) range.push(total)

  return range
})

const changePage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <div class="flex items-center flex-wrap gap-2 md:gap-3 select-none">
    <!-- Prev Button -->
    <CaratButton 
      direction="left" 
      :disabled="currentPage === 1" 
      @click="changePage(currentPage - 1)" 
      class="scale-90 md:scale-100"
    />

    <!-- Page Numbers -->
    <div class="flex items-center flex-wrap gap-1.5 md:gap-2">
      <template v-for="(page, index) in pages" :key="index">
        <!-- Ellipsis -->
        <div
          v-if="page === '...'"
          class="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-lg bg-gray-0 text-gray-300 pointer-events-none text-sm md:text-base"
        >
          ...
        </div>

        <!-- Number Button -->
        <button
          v-else
          @click="changePage(page as number)"
          class="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-lg transition-all duration-200 style-body-2-medium cursor-pointer text-sm md:text-base"
          :class="[
            currentPage === page
              ? 'bg-gray-100 text-white shadow-lg'
              : 'bg-gray-0 text-gray-300 hover:bg-gray-100/10 hover:text-white'
          ]"
        >
          {{ page }}
        </button>
      </template>
    </div>

    <!-- Next Button -->
    <CaratButton 
      direction="right" 
      :disabled="currentPage === totalPages" 
      @click="changePage(currentPage + 1)" 
      class="scale-90 md:scale-100"
    />
  </div>
</template>

<style scoped>
/* Standard styles are managed via utility classes */
</style>
