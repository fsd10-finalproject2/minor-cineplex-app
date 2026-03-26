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
    <path d="M4 6L20 6" :stroke="props.color" stroke-width="2" stroke-linecap="round" />
    <path d="M4 12L20 12" :stroke="props.color" stroke-width="2" stroke-linecap="round" />
    <path d="M4 18L20 18" :stroke="props.color" stroke-width="2" stroke-linecap="round" />
  </svg>
</template>
