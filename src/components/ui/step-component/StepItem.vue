<!-- StepItem.vue -->
<script setup lang="ts">
import DoneIcon from '@/assets/icons/DoneIcon.vue'

type Status = 'completed' | 'active' | 'inactive'

const props = withDefaults(
  defineProps<{
    status?: Status
    step?: number
    label?: string
  }>(),
  {
    status: 'inactive',
    step: 1,
    label: 'Text',
  },
)
</script>

<template>
  <div class="flex flex-col items-center gap-1.5 px-12">
    <!-- Circle -->
    <div
      :class="[
        'w-10 h-10 rounded-full flex items-center justify-center transition-all relative z-10',
        props.status === 'completed' && 'bg-blue-200',
        props.status === 'active' && 'bg-blue-100',
        props.status === 'inactive' && 'bg-transparent border border-gray-100',
      ]"
    >
      <DoneIcon v-if="props.status === 'completed'" />
      <span
        v-else
        :class="['style-headline-4', props.status === 'active' ? 'text-white' : 'text-white']"
      >
        {{ props.step }}
      </span>
    </div>
    <!-- Label -->
    <span class="style-body-2-regular text-white whitespace-nowrap">{{ props.label }}</span>
  </div>
</template>
