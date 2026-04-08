<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
import ToastContainer from '@/components/ui/toast/ToastContainer.vue'
onMounted(async () => {
  await authStore.me()
})
</script>

<template>
  <router-view />
  <ToastContainer />
</template>

<style scoped></style>
