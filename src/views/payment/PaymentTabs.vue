<script setup lang="ts">
import { ref, watch } from 'vue'
import CreditCardForm from './CreditCardForm.vue'
import type { CardFormData } from './CreditCardForm.vue'
import QRCodePayment from '@/components/payment/QRCodePayment.vue'

const props = defineProps<{
  amount?: number
  isProcessing?: boolean
}>()

const emit = defineEmits<{
  'update:activeTab': [tab: 'credit-card' | 'qr-code']
  'update:cardFormData': [data: CardFormData]
  'update:cardFormValid': [valid: boolean]
  simulateQrPayment: []
}>()

const activeTab = ref<'credit-card' | 'qr-code'>('credit-card')
const creditCardFormRef = ref<InstanceType<typeof CreditCardForm> | null>(null)

watch(activeTab, (tab) => {
  emit('update:activeTab', tab)
}, { immediate: true })

function onCardFormUpdate(data: CardFormData) {
  emit('update:cardFormData', data)
}

function onCardFormValidUpdate(valid: boolean) {
  emit('update:cardFormValid', valid)
}

function handleSimulateQrPayment() {
  emit('simulateQrPayment')
}

// Expose the credit card form ref for validation
defineExpose({
  creditCardFormRef,
  activeTab,
})
</script>

<template>
  <div>
    <!-- Tab Buttons -->
    <div class="flex gap-[16px] border-b border-gray-100/10">
      <button
        class="p-[4px] pb-[12px] font-bold style-headline-3"
        :class="
          activeTab === 'credit-card'
            ? 'text-white border-b-2 border-blue-100 -mb-px'
            : 'text-gray-300'
        "
        :disabled="isProcessing"
        @click="activeTab = 'credit-card'"
      >
        Credit Card
      </button>
      <button
        class="p-[4px] pb-[12px] font-bold style-headline-3"
        :class="
          activeTab === 'qr-code' ? 'text-white border-b-2 border-blue-100 -mb-px' : 'text-gray-300'
        "
        :disabled="isProcessing"
        @click="activeTab = 'qr-code'"
      >
        QR Code
      </button>
    </div>

    <!-- Tab Content -->
    <div class="pt-[24px]">
      <CreditCardForm
        v-if="activeTab === 'credit-card'"
        ref="creditCardFormRef"
        :disabled="isProcessing"
        @update:form-data="onCardFormUpdate"
        @update:is-valid="onCardFormValidUpdate"
      />
      <QRCodePayment
        v-if="activeTab === 'qr-code'"
        :amount="amount || 0"
        :is-processing="isProcessing"
        @simulate-payment="handleSimulateQrPayment"
      />
    </div>
  </div>
</template>
