<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: number | string
    color?: string
    strokeWidth?: number | string // add this
  }>(),
  {
    size: 24,
    color: 'currentColor',
    strokeWidth: 1.5, // add this
  },
)
</script>

<template>
  <svg :width="props.size" :height="props.size" viewBox="0 0 24 24" fill="none" v-bind="$attrs">
    <path
      d="M5 14L8.23309 16.4248C8.66178 16.7463 9.26772 16.6728 9.60705 16.2581L18 6"
      :stroke="props.color"
      :stroke-width="props.strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
