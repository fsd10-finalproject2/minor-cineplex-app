<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  active?: boolean
  // Expecting a Vue Component for the icon
  icon?: any 
}>()

const activeClass = computed(() => 
  props.active 
    ? 'bg-blue-200/20 text-blue-100 border border-blue-200/30' 
    : 'text-gray-200 hover:bg-gray-400/10 hover:text-white border border-transparent'
)
</script>

<template>
  <div
    class="flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 cursor-pointer group"
    :class="activeClass"
  >
    <!-- Icon Slot or Prop -->
    <div class="shrink-0">
      <component 
        :is="icon" 
        v-if="icon" 
        class="size-6 transition-colors duration-200" 
        :class="active ? 'text-blue-100' : 'text-gray-200 group-hover:text-white'"
      />
    </div>

    <span class="style-body-1-medium whitespace-nowrap">
      {{ label }}
    </span>
  </div>
</template>

<style scoped>
/* Optional: specific styling for consistency with Figma */
</style>
