<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const login = () => {
  auth.login()
  router.push('/')
}
</script>

<template>
  <div class="p-10">
    <h1>Login Page</h1>
    <button @click="login">Login</button>
  </div>
</template>
