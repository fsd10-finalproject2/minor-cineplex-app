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
    <!-- outer circle -->
    <circle cx="12" cy="12" r="8.5" :stroke="props.color" stroke-width="1" />

    <!-- clock hands -->
    <path
      d="M16.5 12H12.25C12.1119 12 12 11.8881 12 11.75V8.5"
      :stroke="props.color"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
