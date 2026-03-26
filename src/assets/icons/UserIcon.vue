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
    <!-- body -->
    <path
      d="M19.7274 20.4471C19.2716 19.1713 18.2672 18.0439 16.8701 17.2399C15.4729 16.4358 13.7611 16 12 16C10.2389 16 8.52706 16.4358 7.12991 17.2399C5.73276 18.0439 4.72839 19.1713 4.27259 20.4471"
      :stroke="props.color"
      stroke-width="1.5"
      stroke-linecap="round"
    />

    <!-- head -->
    <circle
      cx="12"
      cy="8"
      r="4"
      :fill="color"
      fill-opacity="0.25"
      :stroke="color"
      stroke-width="1.5"
    />
  </svg>
</template>