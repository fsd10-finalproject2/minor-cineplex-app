<script setup lang="ts">
import { computed, onUnmounted, ref, useId, watch } from 'vue'
import CustomButton from '@/components/ui/CustomButton.vue'
import XIcon from '@/assets/icons/XIcon.vue'
import type { CouponCardItem } from '@/types/coupon'
import AppLoader from '@/components/ui/AppLoader.vue'
const props = defineProps<{
  coupon: CouponCardItem
}>()

const isFlipped = ref(false)
const showCodeModal = ref(false)

const isGetCoupon = computed(() => props.coupon.hasCoupon === 'true')

const modalTitleId = useId()

let flipOpenTimer: ReturnType<typeof setTimeout> | null = null

function clearFlipTimer() {
  if (flipOpenTimer) {
    clearTimeout(flipOpenTimer)
    flipOpenTimer = null
  }
}

function onCardClick() {
  // if (!isGetCoupon.value) return
  if (showCodeModal.value) return
  if (!isFlipped.value) {
    isFlipped.value = true
  }
}

function onFlipTransitionEnd(e: TransitionEvent) {
  const el = e.target as HTMLElement
  if (el !== e.currentTarget) return
  if (e.propertyName !== 'transform') return
  if (!isFlipped.value) return
  clearFlipTimer()
  showCodeModal.value = true
}

watch(isFlipped, (v) => {
  clearFlipTimer()
  if (v) {
    flipOpenTimer = setTimeout(() => {
      flipOpenTimer = null
      if (isFlipped.value && !showCodeModal.value) {
        showCodeModal.value = true
      }
    }, 750)
  }
})

function closeCodeModal() {
  if (!showCodeModal.value) return
  showCodeModal.value = false
}

function onModalAfterLeave() {
  isFlipped.value = false
}

function onDocumentKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || e.defaultPrevented || !showCodeModal.value) return
  e.preventDefault()
  closeCodeModal()
}

watch(showCodeModal, (open) => {
  if (typeof document === 'undefined') return
  if (open) {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onDocumentKeydown)
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onDocumentKeydown)
  }
})

onUnmounted(() => {
  clearFlipTimer()
  document.removeEventListener('keydown', onDocumentKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

const cardShellClass =
  'group flex flex-col w-[285px] h-[477px] bg-gray-0 rounded-lg overflow-hidden ' +
  'transition-[transform,box-shadow] duration-300 ease-out ' +
  'motion-reduce:transition-none ' +
  'hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)] ' +
  'motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none ' +
  'focus-within:-translate-y-1 focus-within:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)] ' +
  'motion-reduce:focus-within:translate-y-0 motion-reduce:focus-within:shadow-none'
</script>

<template>

  <section class="w-[285px] h-[477px] perspective-[1000px] cursor-pointer rounded-lg"
    aria-label="Coupon card, click to flip and show code" @click="onCardClick">
    <div
      class="relative h-full w-full transform-3d transition-transform duration-700 ease-out motion-reduce:transition-none motion-reduce:duration-0"
      :class="isFlipped ? 'transform-[rotateY(180deg)]' : 'transform-[rotateY(0deg)]'"
      @transitionend="onFlipTransitionEnd">
      <article :class="[
        cardShellClass,
        'absolute inset-0 backface-hidden transform-[rotateY(0deg)]',
      ]">
        <img :src="coupon.image" :alt="coupon.title" class="w-[285px] h-[285px] object-cover shrink-0
            transition-transform duration-500 ease-out
            motion-reduce:transition-none motion-reduce:duration-0
            group-hover:scale-[1.04]
            motion-reduce:group-hover:scale-100" />
        <div class="flex flex-col gap-6 pt-4 px-6 pb-6">
          <div class="flex flex-col gap-2">
            <h4 class="style-headline-4 text-white line-clamp-2 h-[52px] overflow-hidden">
              {{ coupon.title }}
            </h4>
            <div class="flex flex-row gap-4 items-center">
              <p class="style-body-2-regular text-gray-300">Valid until</p>
              <p class="style-body-2 text-gray-400">{{ coupon.expiredAt }}</p>
            </div>
          </div>

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

  <Teleport to="body">
    <Transition name="coupon-code-modal" @after-leave="onModalAfterLeave">
      <div v-if="showCodeModal" class="coupon-code-modal-root fixed inset-0 z-100 flex items-center justify-center p-4">
        <div class="coupon-code-modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"
          @click="closeCodeModal" />
        <section
          class="coupon-code-modal-panel scrollbar-hide relative z-10 flex h-[90%] w-[90%] max-h-[min(90%,calc(100vh-2rem))] max-w-[min(90%,calc(100vw-2rem))] flex-col rounded-2xl border border-gray-200 bg-gray-800 p-8 text-center text-white shadow-2xl overflow-y-auto"
          role="dialog" aria-modal="true" :aria-labelledby="modalTitleId" @click.stop>
          <button type="button"
            class="absolute right-4 top-4 inline-flex shrink-0 items-center justify-center rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-100"
            aria-label="Close dialog" @click="closeCodeModal">
            <span aria-hidden="true" class="inline-flex text-current">
              <XIcon class="size-5" />
            </span>
          </button>

          <article class="flex flex-1 flex-row items-start justify-start gap-6 p-4 ">

            <img :src="coupon.image" :alt="coupon.title" class="w-[384px] h-[384px] rounded-lg object-cover shrink-0
        transition-transform duration-500 ease-out
        motion-reduce:transition-none motion-reduce:duration-0
        group-hover:scale-[1.04]
        motion-reduce:group-hover:scale-100" />
            <div class="flex flex-col gap-6 w-full h-full bg-gray-0 opacity-70 rounded-lg p-10">
              <h2 class="style-headline-2 text-white text-start line-clamp-2 overflow-hidden">
                {{ coupon.title }}
              </h2>
              <div class="flex flex-row gap-4 items-center">
                <p class="style-body-2-regular text-gray-300 w-[88px] text-start">Valid until</p>
                <p class="style-body-2 text-gray-400">{{ coupon.expiredAt }}</p>
              </div>
              <div class="flex justify-start my-5">
                <CustomButton v-if="isGetCoupon" variant="primary" disabled class="w-[153px] h-[48px]">
                  Coupon Saved
                </CustomButton>
                <CustomButton v-else variant="primary" class="w-[153px] h-[48px]">
                  Get coupon
                </CustomButton>
              </div>
              <div class="flex flex-col justify-start items-start gap-0">
                <p class="style-body-2-regular text-gray-400">{{ coupon.description }}</p>
                <p class="style-body-2-regular text-gray-400">📅 Sales Period: {{ coupon.SalesPeriod }}</p>
                <p class="style-body-2-regular text-gray-400">🎟 Redemption Period: {{ coupon.RedemptionPeriod }}</p>
              </div>
              <div class="flex flex-col justify-start items-start text-start gap-2">
                <p class="style-body-2-regular text-gray-400">Terms and conditions</p>
                <ul class="style-body-2-regular text-gray-400 list-disc list-inside">
                  <li v-for="term in coupon.termsAndConditions" :key="term">
                    {{ term }}
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </section>
      </div>
    </Transition>
  </Teleport>



</template>

<style scoped>
.coupon-code-modal-enter-active .coupon-code-modal-backdrop,
.coupon-code-modal-leave-active .coupon-code-modal-backdrop {
  transition: opacity 0.28s ease;
}

.coupon-code-modal-enter-active .coupon-code-modal-panel,
.coupon-code-modal-leave-active .coupon-code-modal-panel {
  transition:
    transform 0.4s cubic-bezier(0.34, 1.2, 0.64, 1),
    opacity 0.28s ease;
  transform-origin: center;
}

.coupon-code-modal-enter-from .coupon-code-modal-backdrop,
.coupon-code-modal-leave-to .coupon-code-modal-backdrop {
  opacity: 0;
}

.coupon-code-modal-enter-from .coupon-code-modal-panel,
.coupon-code-modal-leave-to .coupon-code-modal-panel {
  transform: scale(0);
  opacity: 0;
}
</style>
