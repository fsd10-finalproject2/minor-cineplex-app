<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

import NavbarBase from './NavbarBase.vue'
import NavbarUser from './NavbarUser.vue'
import NavbarGuest from './NavbarGuest.vue'

const router = useRouter()
const auth = useAuthStore()
const currentUser = computed(() => auth.user!)

const goLogin = () => router.push('/login')
const goRegister = () => router.push('/register')
const handleLogout = async () => {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <NavbarBase>
    <template #right="{ mobile }">
      <NavbarUser
        v-if="auth.isLoggedIn && auth.user"
        :user="auth.user"
        :mobile="mobile"
        @logout="handleLogout"
      />
      <NavbarGuest v-else :mobile="mobile" @login="goLogin" @register="goRegister" />
    </template>

    <template #right-mobile="{ mobile, open }">
      <NavbarUser
        v-if="auth.isLoggedIn"
        :user="currentUser"
        :mobile="mobile"
        :open="open"
        @logout="handleLogout"
      />
      <NavbarGuest v-else :mobile="mobile" @login="goLogin" @register="goRegister" />
    </template>
  </NavbarBase>
</template>
