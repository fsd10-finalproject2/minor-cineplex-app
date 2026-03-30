<template>
  <button :class="variant" @click="$emit('click')" class="group">
    <div class="flex gap-2 style-body-2-regular items-center">
      <span
        class="text-gray-300 w-5 h-5 flex items-center justify-center group-hover:text-white transition-colors"
      >
        <slot name="icon" />
      </span>
      <span class="text-gray-400 group-hover:text-white transition-colors">
        <slot />
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Variant } from '@/types/navbarMenu'
defineProps<{
  variant?: Variant
}>()

defineEmits<{ (e: 'click'): void }>()
</script>
