<script setup lang="ts">
import { ref, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps<{
  loading: boolean
}>()

const loaderRef = ref<HTMLElement | null>(null)
const lightRef = ref<HTMLElement | null>(null)
const dotsRef = ref<HTMLElement | null>(null)
let dotsTween: gsap.core.Tween | null = null

watch(
  () => props.loading,
  (val) => {
    if (val) {
      // dots animate
      let dots = 0
      dotsTween = gsap.to(
        {},
        {
          duration: 0.5,
          repeat: -1,
          onRepeat: () => {
            dots = (dots + 1) % 4
            if (dotsRef.value) {
              dotsRef.value.textContent = '.'.repeat(dots)
            }
          },
        },
      )
    } else {
      gsap.killTweensOf(lightRef.value)
      dotsTween?.kill()
      gsap.to(loaderRef.value, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      })
    }
  },
)
</script>

<template>
  <Transition name="fade">
    <div
      v-if="loading"
      ref="loaderRef"
      class="fixed inset-0 z-999 bg-black/60 backdrop-blur-sm flex items-center justify-center overflow-hidden"
    >
      <!-- glow -->
      <div
        class="absolute w-64 h-64 rounded-full animate-pulse"
        style="
          background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
          filter: blur(40px);
        "
      />

      <!-- logo + loading text -->
      <div class="relative flex flex-col justify-center items-center gap-2">
        <img src="/logo.svg" class="h-10" />
        <div class="flex pl-3 gap-0 text-white style-body-2-regular">
          <span>Loading</span>
          <span ref="dotsRef" class="w-6 text-left">...</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
