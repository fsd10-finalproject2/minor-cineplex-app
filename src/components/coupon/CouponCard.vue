<script setup lang="ts">
import { ChevronDownIcon } from '@/assets/icons'
import { computed, nextTick, onUnmounted, ref, useId, watch } from 'vue'
import CustomButton from '@/components/ui/CustomButton.vue'
import XIcon from '@/assets/icons/XIcon.vue'
import type { CouponCardItem } from '@/types/coupon'
import AppLoader from '@/components/ui/AppLoader.vue'
const props = defineProps<{
  coupon: CouponCardItem
}>()

const isFlipped = ref(false)
const showCodeModal = ref(false)

const modalPanelRef = ref<HTMLElement | null>(null)
const modalSheetRef = ref<HTMLElement | null>(null)
const modalBackdropRef = ref<HTMLElement | null>(null)
const showScrollDownHint = ref(false)

const SCROLL_BOTTOM_EPSILON = 6
const PULL_RUBBER = 0.52
const PULL_DISMISS_RATIO = 0.15
const PULL_MAX_RATIO = 0.42

const pullOffsetPx = ref(0)
const isSheetAnimating = ref(false)

let touchStartY = 0
let touchEligibleForPull = false
let wheelIdleTimer: ReturnType<typeof setTimeout> | null = null
let activeDismissAnim: Animation | null = null
let activeSnapAnim: Animation | null = null

function clearWheelIdleTimer() {
  if (wheelIdleTimer) {
    clearTimeout(wheelIdleTimer)
    wheelIdleTimer = null
  }
}

function motionReduced(): boolean {
  return (
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function pullThresholdPx(): number {
  if (typeof window === 'undefined') return 120
  return window.innerHeight * PULL_DISMISS_RATIO
}

function pullMaxPx(): number {
  if (typeof window === 'undefined') return 400
  return window.innerHeight * PULL_MAX_RATIO
}

function scaleForPullOffset(o: number): number {
  const h = typeof window !== 'undefined' ? window.innerHeight : 800
  return Math.max(0.88, 1 - o / (h * 2.6))
}

function rubberBandPull(deltaY: number): number {
  const max = pullMaxPx()
  const x = Math.min(Math.max(deltaY, 0), max)
  return x * PULL_RUBBER
}

const sheetPullStyle = computed(() => {
  if (isSheetAnimating.value || motionReduced()) return {}
  const o = pullOffsetPx.value
  if (o <= 0) return {}
  return {
    transform: `translateY(${o}px) scale(${scaleForPullOffset(o)})`,
  }
})

const backdropPullStyle = computed(() => {
  if (motionReduced()) return {}
  const o = pullOffsetPx.value
  if (o <= 0) return {}
  const h = typeof window !== 'undefined' ? window.innerHeight : 800
  const t = Math.min(o / (h * 0.32), 1)
  return { opacity: 0.6 * (1 - t * 0.5) }
})

function cancelSheetAnimations() {
  activeDismissAnim?.cancel()
  activeDismissAnim = null
  activeSnapAnim?.cancel()
  activeSnapAnim = null
  modalSheetRef.value?.getAnimations().forEach((a) => a.cancel())
  modalBackdropRef.value?.getAnimations().forEach((a) => a.cancel())
}

function animateSnapBack() {
  const sheet = modalSheetRef.value
  if (!sheet || pullOffsetPx.value <= 0) return
  cancelSheetAnimations()
  if (motionReduced()) {
    pullOffsetPx.value = 0
    return
  }
  isSheetAnimating.value = true
  const start = pullOffsetPx.value
  const startScale = scaleForPullOffset(start)
  activeSnapAnim = sheet.animate(
    [
      { transform: `translateY(${start}px) scale(${startScale})` },
      { transform: 'translateY(0) scale(1)' },
    ],
    { duration: 240, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' },
  )
  activeSnapAnim.onfinish = () => {
    activeSnapAnim = null
    sheet.style.transform = ''
    isSheetAnimating.value = false
    pullOffsetPx.value = 0
  }
}

function animateDismissClose() {
  const sheet = modalSheetRef.value
  const backdrop = modalBackdropRef.value
  if (!sheet) {
    closeCodeModal()
    return
  }
  cancelSheetAnimations()
  if (motionReduced()) {
    pullOffsetPx.value = 0
    closeCodeModal()
    return
  }
  isSheetAnimating.value = true
  const start = pullOffsetPx.value
  const startScale = scaleForPullOffset(start)
  const endY = typeof window !== 'undefined' ? window.innerHeight * 0.52 : 520
  const endScale = 0.86
  const baseBackdropOpacity = 0.6
  const o = pullOffsetPx.value
  const h = typeof window !== 'undefined' ? window.innerHeight : 800
  const backdropT = o > 0 ? Math.min(o / (h * 0.32), 1) : 0
  const currentBackdropOpacity = baseBackdropOpacity * (1 - backdropT * 0.5)

  activeDismissAnim = sheet.animate(
    [
      { transform: `translateY(${start}px) scale(${startScale})`, opacity: 1 },
      {
        transform: `translateY(${endY}px) scale(${endScale})`,
        opacity: 0.35,
      },
    ],
    { duration: 340, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' },
  )
  if (backdrop) {
    backdrop.animate(
      [
        { opacity: currentBackdropOpacity },
        { opacity: 0 },
      ],
      { duration: 320, easing: 'ease-out' },
    )
  }
  activeDismissAnim.onfinish = () => {
    activeDismissAnim = null
    sheet.style.transform = ''
    sheet.style.opacity = ''
    if (backdrop) backdrop.style.opacity = ''
    isSheetAnimating.value = false
    pullOffsetPx.value = 0
    closeCodeModal()
  }
}

function onModalTouchStart(e: TouchEvent) {
  if (!showCodeModal.value || isSheetAnimating.value) return
  const finger = e.touches[0]
  if (!finger) return
  touchStartY = finger.clientY
  const el = modalPanelRef.value
  touchEligibleForPull = !!el && el.scrollTop <= SCROLL_BOTTOM_EPSILON
  if (motionReduced() && touchEligibleForPull) {
    pullOffsetPx.value = 0
  }
}

function onModalTouchMove(e: TouchEvent) {
  if (!showCodeModal.value || isSheetAnimating.value) return
  const el = modalPanelRef.value
  if (!el) return
  const finger = e.touches[0]
  if (!finger) return
  const y = finger.clientY
  const dy = y - touchStartY

  if (el.scrollTop > SCROLL_BOTTOM_EPSILON) {
    if (pullOffsetPx.value > 0) pullOffsetPx.value = 0
    touchEligibleForPull = false
    return
  }

  if (!touchEligibleForPull) {
    touchEligibleForPull = el.scrollTop <= SCROLL_BOTTOM_EPSILON
  }

  if (dy > 0 && touchEligibleForPull) {
    e.preventDefault()
    if (motionReduced()) {
      pullOffsetPx.value = Math.min(dy, pullThresholdPx() * 1.5)
    } else {
      pullOffsetPx.value = rubberBandPull(dy)
    }
  } else if (dy <= 0 && pullOffsetPx.value > 0) {
    pullOffsetPx.value = 0
  }
}

function onModalTouchEnd() {
  if (!showCodeModal.value || isSheetAnimating.value) return
  if (pullOffsetPx.value <= 0) return
  const th = pullThresholdPx()
  if (motionReduced()) {
    if (pullOffsetPx.value >= th) closeCodeModal()
    else pullOffsetPx.value = 0
    return
  }
  if (pullOffsetPx.value >= th) animateDismissClose()
  else animateSnapBack()
}

function onModalWheel(e: WheelEvent) {
  if (!showCodeModal.value || isSheetAnimating.value) return
  const el = modalPanelRef.value
  if (!el) return
  if (el.scrollTop > SCROLL_BOTTOM_EPSILON) {
    clearWheelIdleTimer()
    if (pullOffsetPx.value > 0) pullOffsetPx.value = 0
    return
  }
  if (e.deltaY >= 0) {
    return
  }
  if (motionReduced()) {
    e.preventDefault()
    pullOffsetPx.value = Math.min(
      pullOffsetPx.value + Math.abs(e.deltaY) * 0.45,
      pullThresholdPx() * 1.25,
    )
    if (pullOffsetPx.value >= pullThresholdPx()) {
      pullOffsetPx.value = 0
      closeCodeModal()
    }
    return
  }
  e.preventDefault()
  clearWheelIdleTimer()
  const add = Math.min(Math.abs(e.deltaY) * 0.38, 22)
  pullOffsetPx.value = Math.min(pullOffsetPx.value + add, pullMaxPx())
  const th = pullThresholdPx()
  if (pullOffsetPx.value >= th) {
    clearWheelIdleTimer()
    animateDismissClose()
    return
  }
  wheelIdleTimer = setTimeout(() => {
    wheelIdleTimer = null
    if (pullOffsetPx.value > 0 && pullOffsetPx.value < th) {
      animateSnapBack()
    }
  }, 150)
}

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
  cancelSheetAnimations()
  pullOffsetPx.value = 0
  isSheetAnimating.value = false
  if (modalSheetRef.value) {
    modalSheetRef.value.style.transform = ''
    modalSheetRef.value.style.opacity = ''
  }
  if (modalBackdropRef.value) {
    modalBackdropRef.value.style.opacity = ''
  }
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

let modalScrollTrackedEl: HTMLElement | null = null
let modalPanelResizeObserver: ResizeObserver | null = null

function updateScrollDownHint() {
  const el = modalScrollTrackedEl ?? modalPanelRef.value
  if (!el) {
    showScrollDownHint.value = false
    return
  }
  const { scrollHeight, clientHeight, scrollTop } = el
  const hasOverflow = scrollHeight > clientHeight + SCROLL_BOTTOM_EPSILON
  const atBottom =
    scrollTop + clientHeight >= scrollHeight - SCROLL_BOTTOM_EPSILON
  showScrollDownHint.value = hasOverflow && !atBottom
}

function onModalPanelScroll() {
  updateScrollDownHint()
}

function detachModalScrollTracking() {
  clearWheelIdleTimer()
  if (modalScrollTrackedEl) {
    modalScrollTrackedEl.removeEventListener('scroll', onModalPanelScroll)
    modalScrollTrackedEl.removeEventListener('touchstart', onModalTouchStart)
    modalScrollTrackedEl.removeEventListener('touchmove', onModalTouchMove)
    modalScrollTrackedEl.removeEventListener('touchend', onModalTouchEnd)
    modalScrollTrackedEl.removeEventListener('wheel', onModalWheel)
    modalScrollTrackedEl = null
  }
  modalPanelResizeObserver?.disconnect()
  modalPanelResizeObserver = null
  showScrollDownHint.value = false
}

function attachModalScrollTracking() {
  detachModalScrollTracking()
  const el = modalPanelRef.value
  if (!el) return
  modalScrollTrackedEl = el
  el.addEventListener('scroll', onModalPanelScroll, { passive: true })
  el.addEventListener('touchstart', onModalTouchStart, { passive: true })
  el.addEventListener('touchmove', onModalTouchMove, { passive: false })
  el.addEventListener('touchend', onModalTouchEnd, { passive: true })
  el.addEventListener('wheel', onModalWheel, { passive: false })
  if (typeof ResizeObserver !== 'undefined') {
    modalPanelResizeObserver = new ResizeObserver(() => updateScrollDownHint())
    modalPanelResizeObserver.observe(el)
  }
  updateScrollDownHint()
}

function smoothScrollModalDown() {
  const el = modalScrollTrackedEl ?? modalPanelRef.value
  if (!el) return
  const remaining = el.scrollHeight - el.scrollTop - el.clientHeight
  if (remaining <= 0) return
  const prefersReduced =
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
  const step = Math.min(
    Math.max(Math.floor(el.clientHeight * 0.55), 96),
    remaining,
  )
  el.scrollBy({
    top: step,
    behavior: prefersReduced ? 'auto' : 'smooth',
  })
}

async function scheduleModalScrollHintMeasure() {
  await nextTick()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      attachModalScrollTracking()
    })
  })
}

watch(showCodeModal, (open) => {
  if (typeof document === 'undefined') return
  if (open) {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onDocumentKeydown)
    void scheduleModalScrollHintMeasure()
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onDocumentKeydown)
    detachModalScrollTracking()
  }
})

onUnmounted(() => {
  clearFlipTimer()
  cancelSheetAnimations()
  detachModalScrollTracking()
  document.removeEventListener('keydown', onDocumentKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

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

  <Teleport to="body">
    <Transition name="coupon-code-modal" @after-leave="onModalAfterLeave">
      <div v-if="showCodeModal"
        class="coupon-code-modal-root fixed inset-0 z-100 flex items-center justify-center pt-6 lg:p-4">
        <div ref="modalBackdropRef" class="coupon-code-modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm"
          aria-hidden="true" :style="backdropPullStyle" @click="closeCodeModal" />
        <section ref="modalSheetRef"
          class="coupon-code-modal-panel relative z-10 flex h-full min-h-0 w-full flex-col overflow-hidden rounded-t-2xl lg:rounded-b-2xl border border-gray-200 bg-gray-800 text-center text-white shadow-2xl will-change-transform motion-reduce:will-change-auto xl:h-[90%] xl:w-[90%] xl:max-h-[min(90%,calc(100vh-2rem))] xl:max-w-[min(90%,calc(100vw-2rem))]"
          role="dialog" aria-modal="true" :aria-labelledby="modalTitleId" :style="sheetPullStyle" @click.stop>

          <div ref="modalPanelRef"
            class="coupon-code-modal-scroll-body min-h-0 flex-1 overflow-y-auto scrollbar-hide p-0 "
            :class="showScrollDownHint ? 'pb-28' : ''">
            <header
              class="sticky relation top-0 z-40 flex shrink-0 items-center justify-between gap-3 border-b border-gray-700/50 bg-gray-800/95 px-4 py-3 backdrop-blur-sm supports-backdrop-filter:bg-gray-800/90 lg:px-8 lg:pb-3 ">
              <div class="w-full flex flex-row justify-center items-center gap-2">
                <img src="/logo.svg" alt="Miner Ceniplex" class=" h-8 transition-all ease-in" />   
                <p class="style-headline-4 text-center text-gray-400 mt-1.5">Coupon</p>
              </div>
              <button type="button"
                class="inline-flex shrink-0 absolute right-4 items-center justify-center rounded-full p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-100"
                aria-label="Close dialog" @click="closeCodeModal">
                <span aria-hidden="true" class="inline-flex text-current">
                  <XIcon class="size-5" />
                </span>
              </button>

            </header>
            <article
              class="flex  flex-col lg:flex-row items-start justify-start sm:items-center lg:items-start gap-0 sm:gap-6 lg:gap-6 lg:p-4">
              <div
                class="flex flex-col gap-2 justify-center lg:justify-start items-center lg:items-start w-full lg:w-fit pt-2 lg:pt-0">
                <img :src="coupon.image" :alt="coupon.title" class="w-full sm:w-[75%] md:w-[60%] lg:w-[384px] lg:h-[384px] max-w-[460px] rounded-t-lg  sm:rounded-lg object-cover shrink-0
  transition-transform duration-500 ease-out
  motion-reduce:transition-none motion-reduce:duration-0
  group-hover:scale-[1.04]
  motion-reduce:group-hover:scale-100" />
              </div>
              <div
                class="flex flex-col gap-12 lg:gap-6 w-full sm:w-[75%] sm:max-w-[460px] lg:w-full lg:max-w-full h-full bg-gray-0 opacity-70 sm:rounded-lg p-4 lg:p-10">
                <div class="flex flex-col gap-6">

                  <h2 :id="modalTitleId" class="style-headline-2 text-white text-start lg:line-clamp-2 overflow-hidden">
                    {{ coupon.title }}
                  </h2>
                  <div class="flex flex-row gap-6 lg:gap-4 items-center">
                    <p class="style-body-2-regular text-gray-300 text-start w-fit">Valid until</p>
                    <p class="style-body-2 text-white">{{ coupon.expiredAt }}</p>
                  </div>
                </div>
                <div class="flex justify-start ">
                  <CustomButton v-if="isGetCoupon" variant="primary" disabled class="w-[153px] h-[48px]">
                    Coupon Saved
                  </CustomButton>
                  <CustomButton v-else variant="primary" class="w-[153px] h-[48px]">
                    Get coupon
                  </CustomButton>
                </div>
                <div class="flex flex-col justify-start items-start gap-0">
                  <p class="style-body-2-regular text-gray-400 text-start">{{ coupon.description }}</p>
                  <p class="style-body-2-regular text-gray-400 text-start">📅 Sales Period: {{ coupon.SalesPeriod }}</p>
                  <p class="style-body-2-regular text-gray-400 text-start">🎟 Redemption Period: {{
                    coupon.RedemptionPeriod }}</p>
                </div>
                <div class="flex flex-col justify-start items-start text-start gap-2">
                  <p class="style-body-2-regular text-gray-400">Terms and conditions</p>

                  <ul class="style-body-2-regular text-gray-400 list-disc list-inside">
                    <br />
                    <li v-for="term in coupon.termsAndConditions" :key="term">
                      {{ term }}
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>

          <div v-show="showScrollDownHint"
            class="coupon-code-modal-scroll-hint pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center justify-end lg:rounded-b-2xl bg-linear-to-t from-gray-800 via-gray-800/85 to-transparent pb-3 pt-14 lg:items-end lg:pr-8">
            <button type="button"
              class="coupon-code-modal-scroll-hint-bounce pointer-events-auto flex cursor-pointer flex-col items-center gap-1 rounded-full border-0 bg-transparent p-2 text-gray-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
              aria-label="Scroll down to see more content" @click.stop="smoothScrollModalDown">
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
