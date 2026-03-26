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
    <!-- document -->
    <rect
      x="6"
      y="4"
      width="13"
      height="17"
      rx="2"
      :stroke="props.color"
      stroke-width="1.5"
    />

    <!-- top small line -->
    <path
      d="M15 10V8"
      :stroke="props.color"
      stroke-linecap="round"
      stroke-width="1.5"
    />

    <!-- list lines -->
    <path
      d="M4 9H8"
      :stroke="props.color"
      stroke-linecap="round"
      stroke-width="1.5"
    />
    <path
      d="M4 13H8"
      :stroke="props.color"
      stroke-linecap="round"
      stroke-width="1.5"
    />
    <path
      d="M4 17H8"
      :stroke="props.color"
      stroke-linecap="round"
      stroke-width="1.5"
    />
  </svg>
</template>