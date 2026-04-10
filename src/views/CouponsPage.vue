<script setup lang="ts">
import CouponCard from '@/components/coupon/CouponCard.vue'
import CouponCategoryTabs from '@/components/coupon/CouponCategoryTabs.vue'
import { couponCategoriesMock } from '@/data/couponsMock'
import { computed, ref } from 'vue'
import type { CouponTab } from '@/types/coupon'
import CustomPagination from '@/components/ui/CustomPagination.vue'
import { useSpecialCoupons } from '@/composables/landing/useSpecialCoupons'
import CouponCardSkeleton from '@/components/coupon/CouponCardSkeleton.vue'

/** จำนวนคูปองต่อหน้า — ส่งเป็น `limitItems` ใน GET /promotions */
const COUPONS_PAGE_LIMIT = 8

const activeTab = ref<CouponTab['filter']>('all')
const tabs: CouponTab[] = couponCategoriesMock

const currentPage = ref(1)
const partnerName = computed(() => {
  if (activeTab.value === 'all') {
    return undefined
  }

  const selectedTab = tabs.find((tab) => tab.filter === activeTab.value)
  return selectedTab?.name
})

const { isLoading, displayedCoupons, totalPages } = useSpecialCoupons({
  pageSize: COUPONS_PAGE_LIMIT,
  currentPage,
  partnerName,
})

const shouldShowPagination = computed(() => !isLoading.value && displayedCoupons.value.length > 0)

function handleChangeTab(filter: CouponTab['filter']) {
  if (activeTab.value === filter) {
    return
  }

  activeTab.value = filter
  currentPage.value = 1
}
</script>

<template>
  <section class="flex flex-col items-center w-full">
    <CouponCategoryTabs :tabs="tabs" :active-tab="activeTab" @update:active-tab="handleChangeTab" />

    <div
      class="grid w-fit grid-cols-2 justify-items-center gap-4 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:w-[1200px] xl:grid-cols-4 xl:gap-10"
      :aria-busy="isLoading"
      aria-live="polite"
    >
      <template v-if="isLoading">
        <CouponCardSkeleton
          v-for="n in COUPONS_PAGE_LIMIT"
          :key="`coupon-skeleton-${n}`"
        />
      </template>
      <template v-else>
        <CouponCard v-for="coupon in displayedCoupons" :key="coupon.id" :coupon="coupon" />
      </template>
    </div>
    <div v-if="shouldShowPagination" class="mb-30">
      <CustomPagination v-model:current-page="currentPage" :total-pages="totalPages" class=" w-full " />
    </div>
  </section>
</template>
