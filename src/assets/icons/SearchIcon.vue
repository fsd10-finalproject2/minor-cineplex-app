<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: number | string
    color?: string
  }>(),
  {
    size: 24,
    color: 'currentColor',
  },
)
</script>

<template>
  <svg :width="props.size" :height="props.size" viewBox="0 0 24 24" fill="none" v-bind="$attrs">
    <!-- circle -->
    <circle cx="11" cy="11" r="6" :stroke="props.color" stroke-width="1.5" />

    <!-- handle -->
    <path d="M20 20L17 17" :stroke="props.color" stroke-width="1.5" stroke-linecap="round" />
  </svg>
</template>
