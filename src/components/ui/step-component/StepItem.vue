<!-- StepItem.vue -->
<script setup lang="ts">
import DoneIcon from '@/assets/icons/DoneIcon.vue'

type Status = 'completed' | 'active' | 'inactive'

const props = withDefaults(
  defineProps<{
    status?: Status
    step?: number
    label?: string
    isLast?: boolean
  }>(),
  {
    status: 'inactive',
    step: 1,
    label: 'Text',
    isLast: false
  },
)
</script>

<template>
  <div class="relative flex flex-col items-center gap-1.5 shrink-0">
    <!-- Connecting Line -->
    <div 
      v-if="!isLast"
      class="absolute top-5 left-1/2 w-[calc(100%+40px)] h-px bg-white/10 z-0"
    ></div>

    <!-- Circle -->
    <div
      :class="[
        'w-10 h-10 rounded-full flex items-center justify-center transition-all relative z-10',
        props.status === 'completed' && 'bg-[#1D3D7C]',
        props.status === 'active' && 'bg-[#407BFF]',
        props.status === 'inactive' && 'bg-[#070C1B] border border-gray-100/20',
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
    <span class="style-body-2-regular text-white text-center md:whitespace-nowrap px-1">{{ props.label }}</span>
  </div>
</template>
