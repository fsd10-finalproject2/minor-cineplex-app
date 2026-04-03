import { onUnmounted, ref, watch, type Ref } from 'vue'

/**
 * Encapsulates flip-card behavior and coordinates opening a detail/modal view
 * once the flip animation has completed (with a timeout fallback).
 */
export function useFlipCard(
  isDetailOpen: Ref<boolean>,
  openDetail: () => void,
) {
  const isFlipped = ref(false)

  let flipOpenTimer: ReturnType<typeof setTimeout> | null = null

  function clearFlipTimer() {
    if (flipOpenTimer) {
      clearTimeout(flipOpenTimer)
      flipOpenTimer = null
    }
  }

  function onCardClick() {
    if (isDetailOpen.value) return
    if (!isFlipped.value) {
      isFlipped.value = true
    }
  }

  function onFlipTransitionEnd(e: TransitionEvent) {
    const el = e.target as HTMLElement
    if (el !== e.currentTarget) return
    if (e.propertyName !== 'transform') return
    if (!isFlipped.value || isDetailOpen.value) return
    clearFlipTimer()
    openDetail()
  }

  watch(isFlipped, (flipped) => {
    clearFlipTimer()
    if (flipped && !isDetailOpen.value) {
      flipOpenTimer = setTimeout(() => {
        flipOpenTimer = null
        if (isFlipped.value && !isDetailOpen.value) {
          openDetail()
        }
      }, 750)
    }
  })

  function resetFlip() {
    clearFlipTimer()
    isFlipped.value = false
  }

  onUnmounted(() => {
    clearFlipTimer()
  })

  return {
    isFlipped,
    onCardClick,
    onFlipTransitionEnd,
    resetFlip,
  }
}

