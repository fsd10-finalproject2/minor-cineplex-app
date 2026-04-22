<script setup lang="ts">
import { ref } from 'vue'
import CustomButton from '@/components/ui/CustomButton.vue'

const props = defineProps<{
  amount: number
  isProcessing?: boolean
}>()

const emit = defineEmits<{
  simulatePayment: []
}>()

const showSimulateButton = ref(true)

function handleSimulatePayment() {
  emit('simulatePayment')
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 py-4">
    <div class="text-center">
      <h3 class="style-headline-4 text-white mb-2">Scan to Pay</h3>
      <p class="text-gray-300 text-sm">Scan the QR code with your banking app</p>
    </div>

    <!-- QR Code Placeholder -->
    <div class="bg-white p-4 rounded-lg">
      <div class="w-[200px] h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
        <div class="text-center text-gray-500">
          <svg
            class="w-16 h-16 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            />
          </svg>
          <p class="text-xs">PromptPay QR</p>
          <p class="text-xs">(Test Mode)</p>
        </div>
      </div>
    </div>

    <div class="text-center">
      <p class="text-white font-bold text-xl">THB {{ amount.toLocaleString() }}</p>
      <p class="text-gray-400 text-sm mt-1">Amount to pay</p>
    </div>

    <!-- Simulate Payment Button (for testing) -->
    <div v-if="showSimulateButton" class="w-full max-w-[200px]">
      <CustomButton
        label="Simulate Payment"
        variant="primary"
        :disabled="isProcessing"
        class="w-full"
        @click="handleSimulatePayment"
      />
      <p class="text-gray-400 text-xs text-center mt-2">
        Click to simulate a successful QR payment
      </p>
    </div>

    <div v-if="isProcessing" class="flex items-center gap-2 text-blue-100">
      <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span>Processing payment...</span>
    </div>
  </div>
</template>
