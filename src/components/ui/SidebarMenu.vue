<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MenuLink from '@/components/ui/MenuLink.vue'
import { menuItems } from '@/config/menuItems'
import type { Page } from '@/types/navbarMenu'

const route = useRoute()
const activeId = computed(() => route.name as Page)

defineEmits<{
  (e: 'select', id: string): void
}>()
</script>

<template>
  <aside
    class="sidebar-container w-full md:min-w-64.25 md:w-64.25 h-fit flex flex-row md:flex-col gap-2 rounded-lg"
  >
    <MenuLink
      v-for="item in menuItems"
      :key="item.id"
      class="shrink-0"
      :label="item.label"
      :icon="item.icon"
      :to="item.to"
      :active="activeId === item.id"
    />
  </aside>
</template>

<style scoped>
.sidebar-container {
  background-color: #070c1b;
  padding: 16px 16px 24px 16px;
  box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.5);
  overflow-x: auto;
  overflow-y: visible;
  scrollbar-width: none;
}

.sidebar-container::-webkit-scrollbar {
  display: none;
}

@media (max-width: 765px) {
  .sidebar-container {
    padding: 8px 16px;
    max-width: 100vw;
  }
}
</style>
