<script setup lang="ts">
import StepItem from './StepItem.vue'

type Status = 'completed' | 'active' | 'inactive'

interface Step {
  label: string
  status: Status
}

withDefaults(
  defineProps<{
    steps?: Step[]
  }>(),
  {
    steps: () => [],
  },
)
</script>

<template>
  <div class="flex flex-row w-full max-w-[375px] md:max-w-none justify-center mx-auto gap-[40px] px-4 md:px-0">
    <StepItem
      v-for="(step, index) in steps"
      :key="index"
      :step="index + 1"
      :status="step.status"
      :label="step.label"
      :isLast="index === steps.length - 1"
    />
  </div>
</template>
