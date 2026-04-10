<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CouponCardItem } from '@/types/coupon'
import AppLoader from '@/components/ui/AppLoader.vue'
import CouponCodeModal from '@/components/coupon/CouponCodeModal.vue'
import UIModal from '@/components/ui/modal/Modal.vue'
import AppLogin from '@/components/auth/AppLogin.vue'
import CouponActionButton from '@/components/coupon/CouponActionButton.vue'
import { useFlipCard } from '@/composables/coupon/useFlipCard'
import { useCouponClaim } from '@/composables/coupon/useCouponClaim'
import { formatDisplayDate } from '@/utils/formatDate'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const isLoggedIn = computed(() => auth.isLoggedIn)
const props = defineProps<{
  coupon: CouponCardItem
}>()

const expiredAtDisplay = computed(() => formatDisplayDate(props.coupon.expiresAt))

const isCouponCodeModalOpen = ref(false)
const isLoginModalOpen = ref(false)

const emit = defineEmits<{
  'refresh-coupons': []
}>()

const { isSavingCoupon, isGetCoupon, onGetCouponClick, markCouponAsClaimed } = useCouponClaim({
  couponId: computed(() => props.coupon.id),
  initialHasCoupon: computed(() => props.coupon.hasCoupon),
  isLoggedIn,
  onRequireLogin: () => {
    isLoginModalOpen.value = true
  },
  onLoginHandled: () => {
    if (isLoginModalOpen.value) {
      isLoginModalOpen.value = false
    }
  },
  onClaimSuccess: () => {
    emit('refresh-coupons')
  },
})

function openCouponCodeModal() {
  isCouponCodeModalOpen.value = true
}

const { isFlipped, onCardClick, onFlipTransitionEnd, resetFlip } = useFlipCard(
  isCouponCodeModalOpen,
  openCouponCodeModal,
)

function onModalAfterLeave() {
  resetFlip()
}

function onCouponClaimedFromModal() {
  markCouponAsClaimed()
  emit('refresh-coupons')
}

const cardShellClass =
  'group flex flex-col w-[161px] sm:w-[285px] h-[337px] sm:h-[477px] bg-gray-0 rounded-lg overflow-hidden ' +
  'transition-[transform,box-shadow] duration-300 ease-out ' +
  'motion-reduce:transition-none ' +
  'hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)] ' +
  'motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none ' +
  'focus-within:-translate-y-1 focus-within:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)] ' +
  'motion-reduce:focus-within:translate-y-0 motion-reduce:focus-within:shadow-none'
</script>

<template>

  <section class="w-[161px] sm:w-[285px] h-[337px] sm:h-[477px] perspective-[1000px] cursor-pointer rounded-lg"
    aria-label="Coupon card, click to flip and show code" @click="onCardClick">
    <div
      class="relative h-full w-full transform-3d transition-transform duration-700 ease-out motion-reduce:transition-none motion-reduce:duration-0"
      :class="isFlipped ? 'transform-[rotateY(180deg)]' : 'transform-[rotateY(0deg)]'"
      @transitionend="onFlipTransitionEnd">
      <article :class="[
        cardShellClass,
        'absolute inset-0 backface-hidden transform-[rotateY(0deg)]',
      ]">
        <img :src="coupon.image" :alt="coupon.title" loading="lazy" class="sm:w-[285px] sm:h-[285px] w-[161px] h-[161px] object-cover shrink-0
            transition-transform duration-500 ease-out
            motion-reduce:transition-none motion-reduce:duration-0
            group-hover:scale-[1.04]
            motion-reduce:group-hover:scale-100" />
        <div class="flex flex-col sm:gap-6 gap-4 sm:pt-4 pt-3 sm:px-6 px-3 sm:pb-6 pb-3">
          <div class="flex flex-col gap-2">
            <h4 class="sytle-body-1-medium sm:style-headline-4 text-white line-clamp-2 h-[52px] overflow-hidden">
              {{ coupon.title }}
            </h4>
            <div class="flex flex-row gap-1 sm:gap-4 items-center">
              <p class="style-body-3-regular text-gray-300">Valid until</p>
              <p class="style-body-3 text-gray-400">{{ expiredAtDisplay }}</p>
            </div>
          </div>
          <!-- Button -->
          <div class="flex justify-center">
            <CouponActionButton
              :is-get-coupon="isGetCoupon"
              :is-logged-in="isLoggedIn"
              :is-saving-coupon="isSavingCoupon"
              button-class="w-full h-[48px]"
              @click-get-coupon="onGetCouponClick"
            />
          </div>
        </div>
      </article>

      <article :class="[
        cardShellClass,
        'absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center backface-hidden transform-[rotateY(180deg)]',
      ]">
        <AppLoader :loading="true" />
        <p class="style-body-2-regular text-gray-300">Your code</p>
        <p class="style-headline-4 font-mono text-white tracking-wider">
          MINOR-{{ coupon.id }}-2026
        </p>
        <p class="style-body-2-regular text-gray-400 max-w-[240px]">
          Your code will open in a moment
        </p>
      </article>
    </div>
  </section>

  <CouponCodeModal
    v-model="isCouponCodeModalOpen"
    :coupon="coupon"
    @afterLeave="onModalAfterLeave"
    @claimed="onCouponClaimedFromModal"
  />

  <UIModal v-model="isLoginModalOpen" size="lg" title="" class="flex justify-center items-center">
      <div
    class="flex w-full flex-col items-center justify-center py-auto min-h-[min(70vh,28rem)]"
  >
    <AppLogin suppress-redirect-after-login hide-headline class="w-full max-w-[385px]" />
  </div>
  </UIModal>

</template>
