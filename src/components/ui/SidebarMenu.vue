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
    class="sidebar-container w-[285px] h-fit flex flex-col gap-2 rounded-lg"
  >
    <MenuLink
      v-for="item in items"
      :key="item.id"
      :label="item.label"
      :icon="item.icon"
      :active="activeId === item.id"
      @click="$emit('select', item.id)"
    />
  </aside>
</template>

<style scoped>
.sidebar-container {
  background-color: #070C1B;
  padding: 16px 16px 24px 16px;
  /* Figma shadow: X:4, Y:4, Blur:30, Spread:0, 50% Black */
  box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.5);
}
</style>
