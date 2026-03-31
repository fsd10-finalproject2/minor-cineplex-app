<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: number | string
    color?: string
  }>(),
  {
    size: 24,
    color: 'currentColor',
  }
)
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    v-bind="$attrs"
  >
    <!-- Diagonal grip lines (bottom-right resize handle) -->
    <path
      d="M21 15L15 21M21 9L9 21"
      :stroke="props.color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>