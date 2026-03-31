<template>
  <div class="min-h-screen flex flex-col bg-gray-bg justify-center  md:items-start">

    <AppNavbar />

    <main class="flex-1 px-0 md:px-16 lg:px-40 xl:px-72.5 md:py-15 ">
      <div class="flex flex-col md:flex-row gap-12  ">
        <SidebarMenu />
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/common/nav-bar/AppNavbar.vue'
import SidebarMenu from '@/components/ui/SidebarMenu.vue'
</script>
