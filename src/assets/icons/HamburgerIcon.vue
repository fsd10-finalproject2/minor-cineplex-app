<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: number | string
    color?: string
    open?: boolean
  }>(),
  {
    size: 24,
    color: 'currentColor',
    open: false,
  },
)
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    v-bind="$attrs"
    class="hamburger-icon"
  >
    <!-- Top line: slides to center + rotates to form first diagonal -->
    <path
      d="M4 6L20 6"
      :stroke="props.color"
      stroke-width="1.5"
      stroke-linecap="round"
      :class="['bar', 'bar--top', { 'bar--top-open': props.open }]"
    />
    <!-- Middle line: fades out -->
    <path
      d="M4 12L20 12"
      :stroke="props.color"
      stroke-width="1.5"
      stroke-linecap="round"
      :class="['bar', 'bar--mid', { 'bar--mid-open': props.open }]"
    />
    <!-- Bottom line: slides to center + rotates to form second diagonal -->
    <path
      d="M4 18L20 18"
      :stroke="props.color"
      stroke-width="1.5"
      stroke-linecap="round"
      :class="['bar', 'bar--bot', { 'bar--bot-open': props.open }]"
    />
  </svg>
</template>

<style scoped>
.hamburger-icon {
  /* Ensure transform-origin works correctly inside SVG */
  overflow: visible;
}

.bar {
  transform-origin: center;
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.25s ease;
}

/* Top bar → rotates +45deg around center */
.bar--top {
  transform: translateY(0) rotate(0deg);
}
.bar--top-open {
  transform: translateY(3.6px) rotate(45deg);
}

/* Middle bar → fades out */
.bar--mid {
  opacity: 1;
  transform: scaleX(1);
}
.bar--mid-open {
  opacity: 0;
  transform: scaleX(0);
}

/* Bottom bar → rotates -45deg around center */
.bar--bot {
  transform: translateY(0) rotate(0deg);
}
.bar--bot-open {
  transform: translateY(-5px) rotate(-45deg);
}
</style>
