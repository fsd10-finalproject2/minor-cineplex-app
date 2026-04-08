<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.me()
})
</script>

<template>
  <router-view />
</template>

<style scoped></style>
