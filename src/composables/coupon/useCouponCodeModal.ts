import { nextTick, onUnmounted, ref, watch, type Ref } from 'vue'

const SCROLL_BOTTOM_EPSILON = 6
const PULL_RUBBER = 0.52
const PULL_DISMISS_RATIO = 0.15
const PULL_MAX_RATIO = 0.42

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

function scaleForPullOffset(offset: number): number {
  const h = typeof window !== 'undefined' ? window.innerHeight : 800
  return Math.max(0.88, 1 - offset / (h * 2.6))
}

function rubberBandPull(deltaY: number): number {
  const max = pullMaxPx()
  const x = Math.min(Math.max(deltaY, 0), max)
  return x * PULL_RUBBER
}

export function useCouponCodeModal(isOpen: Ref<boolean>, requestClose: () => void) {
  const modalPanelRef = ref<HTMLElement | null>(null)
  const modalSheetRef = ref<HTMLElement | null>(null)
  const modalBackdropRef = ref<HTMLElement | null>(null)

  const pullOffsetPx = ref(0)
  const isSheetAnimating = ref(false)
  const showScrollDownHint = ref(false)

  let touchStartY = 0
  let touchEligibleForPull = false
  let wheelIdleTimer: ReturnType<typeof setTimeout> | null = null
  let activeDismissAnim: Animation | null = null
  let activeSnapAnim: Animation | null = null

  let modalScrollTrackedEl: HTMLElement | null = null
  let modalPanelResizeObserver: ResizeObserver | null = null

  function clearWheelIdleTimer() {
    if (wheelIdleTimer) {
      clearTimeout(wheelIdleTimer)
      wheelIdleTimer = null
    }
  }

  function applyPullStyles() {
    const sheet = modalSheetRef.value
    const backdrop = modalBackdropRef.value
    const offset = pullOffsetPx.value

    if (!sheet || motionReduced() || offset <= 0) {
      if (sheet) {
        sheet.style.transform = ''
        sheet.style.opacity = ''
      }
      if (backdrop) {
        backdrop.style.opacity = ''
      }
      return
    }

    const h = typeof window !== 'undefined' ? window.innerHeight : 800
    const t = Math.min(offset / (h * 0.32), 1)
    const baseBackdropOpacity = 0.6

    sheet.style.transform = `translateY(${offset}px) scale(${scaleForPullOffset(offset)})`
    sheet.style.opacity = '1'

    if (backdrop) {
      backdrop.style.opacity = String(baseBackdropOpacity * (1 - t * 0.5))
    }
  }

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
      applyPullStyles()
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
      applyPullStyles()
    }
  }

  function closeModal() {
    if (!isOpen.value) return
    cancelSheetAnimations()
    pullOffsetPx.value = 0
    isSheetAnimating.value = false
    applyPullStyles()
    requestClose()
  }

  function animateDismissClose() {
    const sheet = modalSheetRef.value
    const backdrop = modalBackdropRef.value
    if (!sheet) {
      closeModal()
      return
    }
    cancelSheetAnimations()
    if (motionReduced()) {
      pullOffsetPx.value = 0
      applyPullStyles()
      closeModal()
      return
    }
    isSheetAnimating.value = true
    const start = pullOffsetPx.value
    const startScale = scaleForPullOffset(start)
    const endY = typeof window !== 'undefined' ? window.innerHeight * 0.52 : 520
    const endScale = 0.86
    const baseBackdropOpacity = 0.6
    const offset = pullOffsetPx.value
    const h = typeof window !== 'undefined' ? window.innerHeight : 800
    const backdropT = offset > 0 ? Math.min(offset / (h * 0.32), 1) : 0
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
      closeModal()
    }
  }

  function onModalTouchStart(e: TouchEvent) {
    if (!isOpen.value || isSheetAnimating.value) return
    const finger = e.touches[0]
    if (!finger) return
    touchStartY = finger.clientY
    const el = modalPanelRef.value
    touchEligibleForPull = !!el && el.scrollTop <= SCROLL_BOTTOM_EPSILON
    if (motionReduced() && touchEligibleForPull) {
      pullOffsetPx.value = 0
      applyPullStyles()
    }
  }

  function onModalTouchMove(e: TouchEvent) {
    if (!isOpen.value || isSheetAnimating.value) return
    const el = modalPanelRef.value
    if (!el) return
    const finger = e.touches[0]
    if (!finger) return
    const y = finger.clientY
    const dy = y - touchStartY

    if (el.scrollTop > SCROLL_BOTTOM_EPSILON) {
      if (pullOffsetPx.value > 0) {
        pullOffsetPx.value = 0
        applyPullStyles()
      }
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
      applyPullStyles()
    } else if (dy <= 0 && pullOffsetPx.value > 0) {
      pullOffsetPx.value = 0
      applyPullStyles()
    }
  }

  function onModalTouchEnd() {
    if (!isOpen.value || isSheetAnimating.value) return
    if (pullOffsetPx.value <= 0) return
    const th = pullThresholdPx()
    if (motionReduced()) {
      if (pullOffsetPx.value >= th) {
        pullOffsetPx.value = 0
        applyPullStyles()
        closeModal()
      } else {
        pullOffsetPx.value = 0
        applyPullStyles()
      }
      return
    }
    if (pullOffsetPx.value >= th) {
      animateDismissClose()
    } else {
      animateSnapBack()
    }
  }

  function onModalWheel(e: WheelEvent) {
    if (!isOpen.value || isSheetAnimating.value) return
    const el = modalPanelRef.value
    if (!el) return
    if (el.scrollTop > SCROLL_BOTTOM_EPSILON) {
      clearWheelIdleTimer()
      if (pullOffsetPx.value > 0) {
        pullOffsetPx.value = 0
        applyPullStyles()
      }
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
      applyPullStyles()
      if (pullOffsetPx.value >= pullThresholdPx()) {
        pullOffsetPx.value = 0
        applyPullStyles()
        closeModal()
      }
      return
    }
    e.preventDefault()
    clearWheelIdleTimer()
    const add = Math.min(Math.abs(e.deltaY) * 0.38, 22)
    pullOffsetPx.value = Math.min(pullOffsetPx.value + add, pullMaxPx())
    applyPullStyles()
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

  function onDocumentKeydown(e: KeyboardEvent) {
    if (e.key !== 'Escape' || e.defaultPrevented || !isOpen.value) return
    e.preventDefault()
    closeModal()
  }

  watch(
    isOpen,
    (isOpen) => {
      if (typeof document === 'undefined') return
      if (isOpen) {
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', onDocumentKeydown)
        applyPullStyles()
        void scheduleModalScrollHintMeasure()
      } else {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', onDocumentKeydown)
        detachModalScrollTracking()
      }
    },
    { immediate: true },
  )

  onUnmounted(() => {
    cancelSheetAnimations()
    detachModalScrollTracking()
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', onDocumentKeydown)
      document.body.style.overflow = ''
    }
  })

  return {
    modalPanelRef,
    modalSheetRef,
    modalBackdropRef,
    showScrollDownHint,
    smoothScrollModalDown,
    closeModal,
  }
}

