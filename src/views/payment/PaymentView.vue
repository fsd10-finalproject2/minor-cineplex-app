<script setup lang="ts">
import StepperBar from '@/components/ui/step-component/StepperBar.vue'
import PaymentTabs from './PaymentTabs.vue'

const currentSteps = [
  { label: 'Select showtime', status: 'completed' as const },
  { label: 'Select seat', status: 'completed' as const },
  { label: 'Payment', status: 'active' as const },
]
</script>

<template>
  <section
    class="w-full bg-gray-0 flex items-center justify-center border-b border-white/5 h-[102px]"
  >
    <StepperBar :steps="currentSteps" />
  </section>
  <main>
    <div class="flex flex-row py-[80px] px-[120px]">
      <div class="flex flex-2 h-[200px] w-[200px]">
        <PaymentTabs />
      </div>
      <div class="flex flex-1 h-[200px] w-[200px]"></div>
    </div>
  </main>
</template>
