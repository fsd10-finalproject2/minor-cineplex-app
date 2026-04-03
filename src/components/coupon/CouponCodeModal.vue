<script setup lang="ts">
import { computed, useId } from 'vue'
import type { CouponCardItem } from '@/types/coupon'
import CustomButton from '@/components/ui/CustomButton.vue'
import XIcon from '@/assets/icons/XIcon.vue'
import ChevronDownIcon from '@/assets/icons/ChevronDownIcon.vue'
import { useCouponCodeModal } from '@/composables/coupon/useCouponCodeModal'

const props = defineProps<{
  modelValue: boolean
  coupon: CouponCardItem
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  afterLeave: []
}>()

const isGetCoupon = computed(() => props.coupon.hasCoupon)
const modalTitleId = useId()

function requestClose() {
  emit('update:modelValue', false)
}

const { modalPanelRef, modalSheetRef, modalBackdropRef, showScrollDownHint, smoothScrollModalDown, closeModal } =
  useCouponCodeModal(
    computed(() => props.modelValue),
    requestClose,
  )
</script>

<template>
  <Teleport to="body">
    <Transition name="coupon-code-modal" @after-leave="emit('afterLeave')">
      <div
        v-if="modelValue"
        class="coupon-code-modal-root fixed inset-0 z-100 flex items-center justify-center pt-6 lg:p-4"
      >
        <div
          ref="modalBackdropRef"
          class="coupon-code-modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
          @click="closeModal"
        />

        <section
          ref="modalSheetRef"
          class="coupon-code-modal-panel relative z-10 flex h-full min-h-0 w-full flex-col overflow-hidden rounded-t-2xl lg:rounded-b-2xl border border-gray-200 bg-gray-800 text-center text-white shadow-2xl will-change-transform motion-reduce:will-change-auto xl:h-[90%] xl:w-[90%] xl:max-h-[min(90%,calc(100vh-2rem))] xl:max-w-[min(90%,calc(100vw-2rem))]"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="modalTitleId"
          @click.stop
        >
          <div
            ref="modalPanelRef"
            class="coupon-code-modal-scroll-body min-h-0 flex-1 overflow-y-auto scrollbar-hide p-0"
            :class="showScrollDownHint ? 'pb-28' : ''"
          >
            <header
              class="sticky relation top-0 z-40 flex shrink-0 items-center justify-between gap-3 border-b border-gray-700/50 bg-gray-800/95 px-4 py-3 backdrop-blur-sm supports-backdrop-filter:bg-gray-800/90 lg:px-8 lg:pb-3"
            >
              <div class="w-full flex flex-row justify-center items-center gap-2">
                <img src="/logo.svg" alt="Miner Ceniplex" class="h-8 transition-all ease-in" />
                <p class="style-headline-4 text-center text-gray-400 mt-1.5">Coupon</p>
              </div>

              <button
                type="button"
                class="inline-flex shrink-0 absolute right-4 items-center justify-center rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-100"
                aria-label="Close dialog"
                @click="closeModal"
              >
                <span aria-hidden="true" class="inline-flex text-current">
                  <XIcon class="size-5" />
                </span>
              </button>
            </header>

            <article
              class="flex flex-col lg:flex-row items-start justify-start sm:items-center lg:items-start gap-0 sm:gap-6 lg:gap-6 lg:p-4"
            >
              <div
                class="flex flex-col gap-2 justify-center lg:justify-start items-center lg:items-start w-full lg:w-fit pt-2 lg:pt-0"
              >
                <img
                  :src="coupon.image"
                  :alt="coupon.title"
                  class="w-full sm:w-[75%] md:w-[60%] lg:w-[384px] lg:h-[384px] max-w-[460px] rounded-t-lg sm:rounded-lg object-cover shrink-0 transition-transform duration-500 ease-out motion-reduce:transition-none motion-reduce:duration-0 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                />
              </div>

              <div
                class="flex flex-col gap-12 lg:gap-6 w-full sm:w-[75%] sm:max-w-[460px] lg:w-full lg:max-w-full h-full bg-gray-0 opacity-70 sm:rounded-lg p-4 lg:p-10"
              >
                <div class="flex flex-col gap-6">
                  <h2
                    :id="modalTitleId"
                    class="style-headline-2 text-white text-start lg:line-clamp-2 overflow-hidden"
                  >
                    {{ coupon.title }}
                  </h2>
                  <div class="flex flex-row gap-6 lg:gap-4 items-center">
                    <p class="style-body-2-regular text-gray-300 text-start w-fit">Valid until</p>
                    <p class="style-body-2 text-white">{{ coupon.expiredAt }}</p>
                  </div>
                </div>

                <div class="flex justify-start">
                  <CustomButton
                    v-if="isGetCoupon"
                    variant="primary"
                    disabled
                    class="w-[153px] h-[48px]"
                  >
                    Coupon Saved
                  </CustomButton>
                  <CustomButton v-else variant="primary" class="w-[153px] h-[48px]">Get coupon</CustomButton>
                </div>

                <div class="flex flex-col justify-start items-start gap-0">
                  <p class="style-body-2-regular text-gray-400 text-start">{{ coupon.description }}</p>
                  <p class="style-body-2-regular text-gray-400 text-start">
                    📅 Sales Period: {{ coupon.SalesPeriod }}
                  </p>
                  <p class="style-body-2-regular text-gray-400 text-start">
                    🎟 Redemption Period: {{ coupon.RedemptionPeriod }}
                  </p>
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
          </div>

          <div
            v-show="showScrollDownHint"
            class="coupon-code-modal-scroll-hint pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center justify-end lg:rounded-b-2xl bg-linear-to-t from-gray-800 via-gray-800/85 to-transparent pb-3 pt-14 lg:items-end lg:pr-8"
          >
            <button
              type="button"
              class="coupon-code-modal-scroll-hint-bounce pointer-events-auto flex cursor-pointer flex-col items-center gap-1 rounded-full border-0 bg-transparent p-2 text-gray-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
              aria-label="Scroll down to see more content"
              @click.stop="smoothScrollModalDown"
            >
              <ChevronDownIcon :size="28" class="text-current" aria-hidden="true" />
              <span class="style-body-2-regular text-gray-400 max-sm:hidden">Scroll for more</span>
            </button>
          </div>
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
  transform: translateY(min(28vh, 12rem)) scale(0.94);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .coupon-code-modal-enter-from .coupon-code-modal-panel,
  .coupon-code-modal-leave-to .coupon-code-modal-panel {
    transform: none;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .coupon-code-modal-scroll-hint-bounce {
    animation: coupon-code-modal-scroll-hint-bounce 1.35s ease-in-out infinite;
  }
}

@keyframes coupon-code-modal-scroll-hint-bounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(5px);
  }
}
</style>

