<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@/assets/icons'

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
  const delta = 2 // Number of pages to show around current page
  const range = []
  
  for (let i = 1; i <= total; i++) {
    if (
      i === 1 || 
      i === total || 
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i)
    } else if (i === current - delta - 1 || i === current + delta + 1) {
      range.push('...')
    }
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
  <div class="flex items-center gap-2 select-none">
    <!-- Prev Button -->
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="p-2 transition-all duration-200 rounded-lg border border-gray-400/30 dark:border-gray-100/10 text-gray-200 hover:text-white hover:bg-gray-400/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
    >
      <ChevronLeftIcon class="size-5" />
    </button>

    <!-- Page Numbers -->
    <div class="flex items-center gap-2">
      <template v-for="(page, index) in pages" :key="index">
        <!-- Ellipsis -->
        <span
          v-if="page === '...'"
          class="w-10 text-center text-gray-300 pointer-events-none"
        >
          ...
        </span>

        <!-- Number Button -->
        <button
          v-else
          @click="changePage(page as number)"
          class="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 style-body-2-medium cursor-pointer"
          :class="[
            currentPage === page
              ? 'bg-blue-100 text-white shadow-lg shadow-blue-100/20 active-glow'
              : 'text-gray-200 hover:bg-gray-400/10 hover:text-white border border-transparent'
          ]"
        >
          {{ page }}
        </button>
      </template>
    </div>

    <!-- Next Button -->
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="p-2 transition-all duration-200 rounded-lg border border-gray-400/30 dark:border-gray-100/10 text-gray-200 hover:text-white hover:bg-gray-400/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
    >
      <ChevronRightIcon class="size-5" />
    </button>
  </div>
</template>

<style scoped>
.active-glow {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
}
</style>
