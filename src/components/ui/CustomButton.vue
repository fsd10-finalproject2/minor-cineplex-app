<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost'

const props = withDefaults(
  defineProps<{
    label?: string
    variant?: Variant
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    disabled: false,
  },
)

const baseClass = 'rounded-md style-button transition-colors duration-200 cursor-pointer'

const variantMap = {
  primary: `
    bg-blue-100 text-white py-2 px-7
    enabled:hover:bg-blue-200 enabled:active:bg-blue-300
    dark:bg-blue-100 
    enabled:dark:hover:bg-blue-200 enabled:dark:active:bg-blue-300
    disabled:opacity-50 disabled:cursor-not-allowed 
  `,

  secondary: `
    bg-transparent border border-gray-300  py-2 px-7
    enabled:hover:bg-gray-200 enabled:active:bg-gray-300
    text-white dark:border-gray-600
    enabled:dark:hover:bg-gray-700 enabled:dark:active:bg-gray-600
    disabled:opacity-50 disabled:cursor-not-allowed 
  `,

  ghost: `
    underline px-0
    enabled:hover:text-gray-600 enabled:active:text-gray-800
    text-white enabled:dark:hover:text-gray-300
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-black  disabled:dark:hover:text-white
  `,
} as const

const variantClass = computed(() => {
  return variantMap[props.variant] ?? variantMap.primary
})
const classes = computed(() => [baseClass, variantClass.value, props.disabled && ''])
</script>

<template>
  <button :disabled="props.disabled" :class="classes">
    <slot>{{ label }}</slot>
  </button>
</template>
