<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { HamburgerIcon } from '@/assets/icons'
import gsap from 'gsap'

const menuOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const hamburgerRef = ref<HTMLElement | null>(null)

function toggleMenu() {
  if (menuOpen.value) {
    closeMenu()
  } else {
    menuOpen.value = true
  }
}

function closeMenu() {
  if (!dropdownRef.value) return
  gsap.to(dropdownRef.value, {
    opacity: 0,
    y: -12,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      menuOpen.value = false
    },
  })
}

function handleOutsideClick(e: MouseEvent) {
  const target = e.target as Node | null
  if (
    menuOpen.value &&
    dropdownRef.value &&
    hamburgerRef.value &&
    !dropdownRef.value.contains(target) &&
    !hamburgerRef.value.contains(target)
  ) {
    closeMenu()
  }
}

watch(menuOpen, (val) => {
  if (!dropdownRef.value) return

  if (val) {
    gsap.fromTo(
      dropdownRef.value,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' },
    )
  }
})

onMounted(() => {
  gsap.from(navRef.value, {
    opacity: 0,
    y: -20,
    duration: 0.5,
    ease: 'power2.out',
  })

  document.addEventListener('mousedown', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
})
</script>

<template>
  <nav
    ref="navRef"
    class="navbar w-full bg-black/20 border-b border-gray-100 relative sticky top-0 backdrop-blur-sm z-100"
  >
    <div
      class="flex items-center justify-between px-4 md:px-20 h-12 md:h-20 gap-1 transition-all duration-300"
    >
      <!-- Logo -->
      <RouterLink to="/" class="navbar-logo">
        <img src="/logo.svg" class="md:h-[44.5px] h-8 transition-all ease-in" />
      </RouterLink>

      <!-- Right (desktop) -->
      <div class="navbar-right hidden md:flex items-center">
        <slot name="right" :mobile="false" />
      </div>

      <!-- Hamburger (mobile) -->
      <button
        ref="hamburgerRef"
        class="md:hidden flex items-center justify-center"
        @click="toggleMenu"
      >
        <HamburgerIcon class="text-white" :open="menuOpen" />
      </button>
    </div>
  </nav>

  <Teleport to="body">
    <div
      v-show="menuOpen"
      ref="dropdownRef"
      class="fixed top-12 left-0 right-0 z-50 md:hidden bg-black/20 backdrop-blur-sm px-4 py-6 border-b border-gray-100"
    >
      <div class="flex flex-col gap-3">
        <slot name="center" :mobile="true" />
      </div>
      <div class="flex flex-col">
        <slot name="right-mobile" :mobile="true" :open="menuOpen" />
      </div>
    </div>
  </Teleport>
</template>
