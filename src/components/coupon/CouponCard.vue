<script setup lang="ts">
import { computed, ref } from 'vue'
import CustomButton from '@/components/ui/CustomButton.vue'
import type { CouponCardItem } from '@/types/coupon'
import AppLoader from '@/components/ui/AppLoader.vue'
import CouponCodeModal from '@/components/coupon/CouponCodeModal.vue'
import { useFlipCard } from '@/composables/coupon/useFlipCard'

const props = defineProps<{
  coupon: CouponCardItem
}>()

const isCouponCodeModalOpen = ref(false)

const isGetCoupon = computed(() => props.coupon.hasCoupon)

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
        <img :src="coupon.image" :alt="coupon.title" class="sm:w-[285px] sm:h-[285px] w-[161px] h-[161px] object-cover shrink-0
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
              <p class="style-body-2-regular text-gray-300">Valid until</p>
              <p class="style-body-2 text-gray-400">{{ coupon.expiredAt }}</p>
            </div>
          </div>
          <!-- Button -->
          <div class="flex justify-center">
            <CustomButton v-if="isGetCoupon" variant="secondary" class="w-full h-[48px]" type="button">
              View details
            </CustomButton>
            <CustomButton v-else variant="primary" class="w-full h-[48px]" type="button">
              Get coupon
            </CustomButton>
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

  <CouponCodeModal v-model="isCouponCodeModalOpen" :coupon="coupon" @afterLeave="onModalAfterLeave" />

</template>
