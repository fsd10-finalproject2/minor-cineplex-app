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
  <section class="flex flex-col items-center w-full">
    <header class="bg-gray-0 w-full h-[118px] flex justify-center items-center">
      <div class="flex flex-wrap w-[1200px] justify-start items-center gap-6 md:gap-8" aria-label="Coupon categories">
        <button v-for="tab in tabs" :key="tab.id" type="button"
          class="style-headline-3 border-b-2 border-transparent transition-colors duration-200 hover:text-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
          :class="activeTab === tab.filter
              ? 'text-white font-bold border-white'
              : 'text-gray-400 font-normal'
            " :aria-current="activeTab === tab.filter ? 'true' : undefined" @click="activeTab = tab.filter">
          {{ tab.name }}
        </button>
      </div>
    </header>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 py-10 w-[1200px] justify-items-center">
      <CouponCard v-for="coupon in displayedCoupons" :key="coupon.id" :coupon="coupon" />
    </div>
    <div class="mb-30">
      <CustomPagination v-model:currentPage="currentPage" :totalPages="totalPages" class=""/>
    </div>

  </section>
</template>
