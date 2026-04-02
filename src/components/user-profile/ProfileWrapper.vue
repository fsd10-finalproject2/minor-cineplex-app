<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="user-profile-wrapper w-full max-w-[374px] md:max-w-[711px] min-h-[636px] md:min-h-[596px] pb-10 flex flex-col px-6 md:px-0 gap-10 overflow-y-auto">

    <!-- Shared Header Spec (Roboto Condensed 700, 36px/44px) -->
    <div class="flex flex-col gap-8">
      <h1 class="style-headline-2 text-white">{{ title }}</h1>
      <p v-if="description" class="style-body-2-regular text-gray-300 max-w-[380px] whitespace-pre-line">
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
