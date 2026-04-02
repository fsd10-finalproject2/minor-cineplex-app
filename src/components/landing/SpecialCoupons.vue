<script setup lang="ts">
import CustomButton from '@/components/ui/CustomButton.vue'
import CouponCard from '@/components/coupon/CouponCard.vue'
import { couponsMock } from '@/data/couponsMock'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToCouponsPage() {
    router.push({ path: '/coupons' })
}

const specialCoupons = ref(couponsMock)
const displayedCoupons = computed(() => specialCoupons.value.slice(0, 4))

</script>



<template>
    <section class="flex flex-col items-center gap-10 py-20 px-30 w-full">
        <div class="flex flex-row justify-between items-end w-[1200px]">
            <h2 class="style-headline-2 text-white">Special Coupons</h2>
            <CustomButton variant="ghost" class="style-body-1-medium h-[44px] w-[51px] p-0!" @click="goToCouponsPage">
                View all
            </CustomButton>
        </div>

        <div class="grid grid-cols-4 gap-5 w-[1200px]">
            <CouponCard v-for="coupon in displayedCoupons" :key="coupon.id" :coupon="coupon" />
        </div>

    </section>

</template>
