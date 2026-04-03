<template>
  <div class="min-h-screen flex flex-col bg-gray-bg">
    <AppNavbar />

    <main class="flex-1">
      <router-view />

    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/common/nav-bar/AppNavbar.vue'
import AppFooter from '@/components/common/footer/AppFooter.vue'

</script>
