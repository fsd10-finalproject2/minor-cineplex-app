<script setup lang="ts">
import { computed, type Component } from 'vue'

const props = defineProps<{
  label: string
  active?: boolean
  icon?: Component
  to?: string | object
}>()

const activeClass = computed(() =>
  props.active
    ? 'bg-gray-100 text-gray-300'
    : 'bg-gray-0 text-gray-400 hover:bg-gray-100/30 hover:text-gray-300'
)
</script>

<template>
  <component
    :is="to ? 'router-link' : 'div'"
    v-bind="to ? { to } : {}"
    class="flex items-center gap-4 px-5 py-4 rounded-lg transition-all duration-200 cursor-pointer group select-none no-underline"
    :class="activeClass"
  >
    <!-- Icon Container -->
    <div class="shrink-0">
      <component
        :is="icon"
        v-if="icon"
        class="size-6 transition-colors duration-200"
        :class="active ? 'text-gray-200' : 'text-gray-300 group-hover:text-gray-200'"
      />
    </div>

    <!-- Label -->
    <span class="style-body-1-medium whitespace-nowrap">
      {{ label }}
    </span>
  </component>
</template>

<style scoped>
/* Optional: specific styling for consistency with Figma */
</style>
