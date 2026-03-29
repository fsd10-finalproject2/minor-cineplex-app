<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import NavbarBase from './NavbarBase.vue'
import NavbarUser from './NavbarUser.vue'
import NavbarGuest from './NavbarGuest.vue'

const router = useRouter()

// Mock user
const isLoggedIn = ref(true)
const mockUser = ref({
  name: 'John Doe',
  avatar: undefined,
})

const goLogin = () => router.push('/login')
const goRegister = () => router.push('/register')
const handleLogout = () => router.push('/')
</script>

<template>
  <NavbarBase>
    <template #right="{ mobile }">
      <NavbarUser v-if="isLoggedIn" :user="mockUser" :mobile="mobile" @logout="handleLogout" />
      <NavbarGuest v-else :mobile="mobile" @login="goLogin" @register="goRegister" />
    </template>

    <template #right-mobile="{ mobile, open }">
      <NavbarUser
        v-if="isLoggedIn"
        :user="mockUser"
        :mobile="mobile"
        :open="open"
        @logout="handleLogout"
      />
      <NavbarGuest v-else :mobile="mobile" @login="goLogin" @register="goRegister" />
    </template>
  </NavbarBase>
</template>
