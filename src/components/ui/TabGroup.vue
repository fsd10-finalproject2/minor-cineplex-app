<script setup lang="ts">
export interface TabItem {
  id: string | number
  label: string
}

const props = defineProps<{
  tabs: TabItem[]
  modelValue: string | number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const selectTab = (id: string | number) => {
  emit('update:modelValue', id)
}
</script>

<template>
  <div class="flex gap-8 border-b border-gray-400/30 dark:border-gray-100/10">
    <button
      v-for="tab in (props.tabs as TabItem[])"
      :key="tab.id"
      @click="selectTab(tab.id)"
      class="relative pb-3 transition-all duration-200 cursor-pointer outline-none group text-left"
      :class="[
        modelValue === tab.id
          ? 'text-base dark:text-white font-bold'
          : 'text-gray-200 dark:text-gray-300 hover:text-base dark:hover:text-white font-medium'
      ]"
    >
      <span class="style-headline-4">{{ tab.label }}</span>
      
      <!-- Underline Indicator -->
      <div 
        class="absolute bottom-0 left-0 w-full h-[3px] transition-all duration-300 transform"
        :class="[
          modelValue === tab.id 
            ? 'bg-blue-100 scale-x-100' 
            : 'bg-transparent scale-x-0 group-hover:bg-gray-400 group-hover:scale-x-50'
        ]"
      />
    </button>
  </div>
</template>

<style scoped>
/* Ensure smooth transitions for the underline */
.transform {
  transform-origin: left;
}
</style>
