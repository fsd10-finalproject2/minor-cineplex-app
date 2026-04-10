<script setup lang="ts">
import type { CouponTab } from '@/types/coupon'

interface Props {
  tabs: CouponTab[]
  activeTab: CouponTab['filter']
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:activeTab': [value: CouponTab['filter']]
}>()

function isTabActive(filter: CouponTab['filter']) {
  return props.activeTab === filter
}

function handleTabClick(filter: CouponTab['filter']) {
  if (props.activeTab === filter) {
    return
  }

  emit('update:activeTab', filter)
}
</script>

<template>
  <header class="bg-gray-0 flex min-h-[118px] w-full min-w-0 items-stretch justify-center py-4 sm:h-[118px] sm:py-0">
    <div
      class="flex min-h-0 w-full max-w-full min-w-0 flex-nowrap items-center justify-start gap-6 overflow-x-auto overflow-y-hidden overscroll-x-contain px-7 sm:flex-wrap sm:justify-center sm:overflow-x-visible xl:w-[1200px] xl:max-w-[1200px] xl:justify-start md:gap-8"
      aria-label="Coupon categories"
      role="tablist"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="style-headline-3 shrink-0 border-b-2 border-transparent transition-colors duration-200 hover:text-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
        :class="
          isTabActive(tab.filter)
            ? 'text-white font-bold border-white'
            : 'text-gray-400 font-normal'
        "
        :aria-current="isTabActive(tab.filter) ? 'true' : undefined"
        @click="handleTabClick(tab.filter)"
      >
        {{ tab.name }}
      </button>
    </div>
  </header>
</template>
