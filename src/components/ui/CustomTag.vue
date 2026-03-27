<script setup lang="ts">
import { computed } from 'vue'
type Variant = 'genre' | 'lang'

const props = withDefaults(
  defineProps<{
    variant?: Variant
  }>(),
  {
    variant: 'genre',
  },
)

const baseClass =
  'inline-flex items-center py-1.5 px-3 rounded-sm bg-gray-100 text-center whitespace-nowrap'

const variantMap: Record<Variant, string> = {
  genre: 'style-body-2-regular text-gray-300',
  lang: 'style-body-2-medium text-gray-400',
}

const classes = computed(() => [baseClass, variantMap[props.variant]])
</script>

<template>
  <button :class="classes"><slot /></button>
</template>
