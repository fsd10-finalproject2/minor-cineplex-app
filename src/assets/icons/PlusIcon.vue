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
    <path d="M12 6L12 18" :stroke="props.color" stroke-width="1" stroke-linecap="round" />
    <path d="M18 12L6 12" :stroke="props.color" stroke-width="1" stroke-linecap="round" />
  </svg>
</template>
