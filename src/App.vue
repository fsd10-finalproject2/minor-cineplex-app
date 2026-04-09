<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ToastContainer from '@/components/ui/toast/ToastContainer.vue'
import { useErrorHandler, ErrorHandlerKey } from '@/composables/useErrorHandler'
import { provide } from 'vue'

const authStore = useAuthStore()

const errorHandler = useErrorHandler()
provide(ErrorHandlerKey, errorHandler)

onMounted(async () => {
  await authStore.me()
})
</script>

<template>
  <router-view />
  <ToastContainer />
</template>

<style scoped></style>
