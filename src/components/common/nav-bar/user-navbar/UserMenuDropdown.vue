<template>
  <div
    v-if="visible"
    ref="dropdownRef"
    class="absolute top-18 right-21.25 z-50 text-gray-400 bg-gray-100 rounded-sm p-4 "
  >
    <DropdownItemList @navigate="$emit('navigate', $event)" @logout="$emit('logout')" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import gsap from 'gsap'
import DropdownItemList from './DropdownItemList.vue'
import type { User, Page } from '@/types/navbarMenu'

const props = defineProps<{
  user: User
  open: boolean
  avatarSrc: string
}>()

defineEmits<{
  (e: 'navigate', page: Page): void
  (e: 'logout'): void
}>()

const dropdownRef = ref<HTMLElement | null>(null)
const visible = ref(false)

watch(
  () => props.open,
  async (val) => {
    if (val) {
      visible.value = true
      await nextTick()
      if (!dropdownRef.value) return
      gsap.fromTo(
        dropdownRef.value,
        { opacity: 0, y: -8, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power3.out' },
      )
    } else {
      if (!dropdownRef.value) {
        visible.value = false
        return
      }
      gsap.to(dropdownRef.value, {
        opacity: 0,
        y: -8,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          visible.value = false
        },
      })
    }
  },
)
</script>
