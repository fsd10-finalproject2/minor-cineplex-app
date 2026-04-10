<script setup lang="ts">
import CustomButton from '@/components/ui/CustomButton.vue'
import CouponCard from '@/components/coupon/CouponCard.vue'
import CouponCardSkeleton from '@/components/coupon/CouponCardSkeleton.vue'
import { SPECIAL_COUPONS_PAGE_SIZE, useSpecialCoupons } from '@/composables/landing/useSpecialCoupons'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { isLoading, displayedCoupons, load } = useSpecialCoupons()

function goToCouponsPage() {
  router.push({ path: '/coupons' })
}

onMounted(() => {
  void load()
})
</script>

<template>
  <section class="flex flex-col items-center gap-10 py-10 xl:py-20 xl:px-30 w-full">
    <div class="flex flex-row justify-between items-end w-[90%] xl:w-[1200px]">
      <h2 class="style-headline-2 text-white">Special Coupons</h2>
      <CustomButton variant="ghost" class="style-body-1-medium h-[44px] w-[51px] p-0!" @click="goToCouponsPage">
        View all
      </CustomButton>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-fit xl:w-[1200px]" :aria-busy="isLoading"
      aria-live="polite">
      <template v-if="isLoading">
        <CouponCardSkeleton v-for="n in SPECIAL_COUPONS_PAGE_SIZE" :key="`coupon-skeleton-${n}`" />
      </template>
      <template v-else>
        <CouponCard v-for="coupon in displayedCoupons" :key="coupon.id" :coupon="coupon" />
      </template>
    </div>
  </section>
</template>
