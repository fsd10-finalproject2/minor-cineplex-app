<template>
  <UserMenu :user="user" :mobile="mobile" @logout="$emit('logout')" />
  <UserMenuMobile
    v-if="mobile"
    :user="user"
    :open="open"
    :avatarSrc="avatarSrc"
    @navigate="navigate"
    @logout="$emit('logout')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import UserMenu from './user-navbar/UserMenu.vue'
import UserMenuMobile from './user-navbar/UserMenuMobile.vue'
import type { Page } from '@/types/navbarMenu'

interface User {
  name: string
  avatar?: string
}

const { user, mobile, open } = defineProps<{
  user: User
  mobile?: boolean
  open?: boolean
}>()

defineEmits<{ (e: 'logout'): void }>()

const router = useRouter()

const avatarSrc = computed(
  () =>
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6c63ff&color=fff`,
)

function navigate(page: Page) {
  router.push(`/${page}`)
}
</script>
