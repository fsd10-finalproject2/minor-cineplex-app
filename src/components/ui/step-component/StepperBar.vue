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
  <div class="flex flex-row md:gap-6 gap-0 transition-all ease-in">
    <StepItem
      v-for="(step, index) in steps"
      :key="index"
      :step="index + 1"
      :status="step.status"
      :label="step.label"
    />
  </div>
</template>
