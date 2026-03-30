<script setup lang="ts">
import CustomButton from '@/components/ui/CustomButton.vue'

withDefaults(defineProps<{ mobile?: boolean }>(), { mobile: false })
defineEmits(['login', 'register'])
</script>

<template>
  <div :class="mobile ? 'flex flex-col w-full gap-2' : 'flex flex-row items-center gap-6'">
    <button
      @click="$emit('login')"
      class="style-body-2-regular text-gray-400"
      :class="mobile ? 'w-full px-2 py-2 ' : 'px-6 py-4 hover:text-gray-500 transition-all ease-in'"
    >
      Login
    </button>

    <CustomButton
      variant="secondary"
      :class="mobile ? 'w-full justify-center' : ''"
      @click="$emit('register')"
    >
      Register
    </CustomButton>
  </div>
</template>
