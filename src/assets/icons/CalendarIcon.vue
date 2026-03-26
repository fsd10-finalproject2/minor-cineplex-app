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
    <rect x="3" y="6" width="18" height="15" rx="2" :stroke="props.color" stroke-width="1.5" />
    <path
      d="M3 10C3 8.11438 3 7.17157 3.58579 6.58579C4.17157 6 5.11438 6 7 6H17C18.8856 6 19.8284 6 20.4142 6.58579C21 7.17157 21 8.11438 21 10H3Z"
      :fill="props.color"
    />
    <path d="M7 3L7 6" :stroke="props.color" stroke-width="1.5" stroke-linecap="round" />
    <path d="M17 3L17 6" :stroke="props.color" stroke-width="1.5" stroke-linecap="round" />
  </svg>
</template>
