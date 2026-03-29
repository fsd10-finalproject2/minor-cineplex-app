<script setup lang="ts">
import { type Component } from 'vue'
import MenuLink from '@/components/ui/MenuLink.vue'

interface MenuItem {
  id: string
  label: string
  icon: Component
  to?: string
}

defineProps<{
  items: MenuItem[]
  activeId?: string
}>()

defineEmits<{
  (e: 'select', id: string): void
}>()
</script>

<template>
  <aside 
    class="sidebar-container w-full md:w-[285px] h-fit flex flex-row md:flex-col gap-2 rounded-lg overflow-x-auto md:overflow-visible no-scrollbar"
  >
    <MenuLink
      v-for="item in items"
      :key="item.id"
      class="shrink-0"
      :label="item.label"
      :icon="item.icon"
      :to="item.to"
      :active="activeId === item.id"
      @click="$emit('select', item.id)"
    />
  </aside>
</template>

<style scoped>
.sidebar-container {
  background-color: #070C1B;
  padding: 16px;
  /* Figma shadow: X:4, Y:4, Blur:30, Spread:0, 50% Black */
  box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .sidebar-container {
    padding: 8px; /* Match the tighter mobile screenshot */
  }
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
