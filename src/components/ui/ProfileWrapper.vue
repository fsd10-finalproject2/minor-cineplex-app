<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="user-profile-wrapper w-full max-w-[374px] h-[636px] mx-auto pt-10 px-4 pb-10 flex flex-col gap-10 overflow-y-auto">
    
    <!-- Shared Header Spec (Roboto Condensed 700, 36px/44px) -->
    <div class="flex flex-col gap-2">
      <h1 class="text-white font-bold tracking-tight text-[36px] leading-[44px] font-['Roboto_Condensed'] uppercase">{{ title }}</h1>
      <p v-if="description" class="style-body-2-regular text-gray-300 max-w-[280px]">
        {{ description }}
      </p>
    </div>

    <!-- The Magic Slot: Content goes here! -->
    <div class="flex flex-col gap-6">
      <slot />
    </div>

  </div>
</template>

<style scoped>
.user-profile-wrapper {
  scrollbar-width: none;
}
.user-profile-wrapper::-webkit-scrollbar {
  display: none;
}
</style>
