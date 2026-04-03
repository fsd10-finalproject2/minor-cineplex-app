<script setup lang="ts">
import CouponCard from '@/components/coupon/CouponCard.vue'
import { couponsMock, couponCategoriesMock } from '@/data/couponsMock'
import { computed, ref } from 'vue'
import type { CouponTab } from '@/types/coupon'
import CustomPagination from '@/components/ui/CustomPagination.vue'
const activeTab = ref<CouponTab['filter']>('all')
const tabs = ref<CouponTab[]>(couponCategoriesMock);

/** Mock: แสดงได้สูงสุด 8 รายการ ไม่ว่าข้อมูลต้นทางจะมีกี่รายการ */
const MAX_COUPONS_DISPLAY = 8

const specialCoupons = ref(couponsMock)
const displayedCoupons = computed(() => specialCoupons.value.slice(0, MAX_COUPONS_DISPLAY))
const currentPage = ref(1)
const totalPages = ref(20)
</script>

<template>
  <section class="flex flex-col items-center w-full ">
    <header class="bg-gray-0 flex min-h-[118px] w-full min-w-0 items-stretch justify-center py-4 sm:h-[118px] sm:py-0">
      <div
        class="flex min-h-0 w-full max-w-full min-w-0 flex-nowrap items-center justify-start gap-6 overflow-x-auto overflow-y-hidden overscroll-x-contain px-7 sm:flex-wrap sm:justify-center sm:overflow-x-visible xl:w-[1200px] xl:max-w-[1200px] xl:justify-start md:gap-8"
        aria-label="Coupon categories"
        role="tablist"
      >
        <button v-for="tab in tabs" :key="tab.id" type="button"
          class="style-headline-3 shrink-0 border-b-2 border-transparent transition-colors duration-200 hover:text-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
          :class="activeTab === tab.filter
              ? 'text-white font-bold border-white'
              : 'text-gray-400 font-normal'
            " :aria-current="activeTab === tab.filter ? 'true' : undefined" @click="activeTab = tab.filter">
          {{ tab.name }}
        </button>
      </div>
    </header>

    <div
      class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-10 gap-4 py-10 xl:w-[1200px] w-fit justify-items-center">
      <CouponCard v-for="coupon in displayedCoupons" :key="coupon.id" :coupon="coupon" />
    </div>
    <div class="mb-30">
      <CustomPagination v-model:currentPage="currentPage" :totalPages="totalPages" class=""/>
    </div>

  </section>
</template>
