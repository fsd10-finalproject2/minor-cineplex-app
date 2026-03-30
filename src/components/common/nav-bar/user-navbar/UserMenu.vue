<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import UserMenuTrigger from './UserMenuTrigger.vue'
import UserMenuDropdown from './UserMenuDropdown.vue'
import type { User, Page } from '@/types/navbarMenu'

const { user } = defineProps<{ user: User; mobile?: boolean }>()
const emit = defineEmits<{ (e: 'logout'): void }>()

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const router = useRouter()

const avatarSrc = computed(
  () =>
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6c63ff&color=fff`,
)

function navigate(page: Page) {
  open.value = false
  router.push(`/${page}`)
}

function handleLogout() {
  open.value = false
  emit('logout')
}

function handleOutsideClick(e: MouseEvent) {
  const target = e.target as Node | null
  if (menuRef.value && target && !menuRef.value.contains(target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))
</script>

<template>
  <div class="user-menu" ref="menuRef">
    <UserMenuTrigger
      :user="user"
      :open="open"
      :avatarSrc="avatarSrc"
      :mobile="mobile"
      @toggle="open = !open"
    />

    <!-- Desktop only -->
    <UserMenuDropdown
      v-if="!mobile"
      :user="user"
      :open="open"
      :avatarSrc="avatarSrc"
      @navigate="navigate"
      @logout="handleLogout"
    />
  </div>
</template>
