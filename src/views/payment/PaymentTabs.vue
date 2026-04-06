<script setup lang="ts">
import { ref } from 'vue'
import CreditCardForm from './CreditCardForm.vue'

const activeTab = ref<'credit-card' | 'qr-code'>('credit-card')
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
        @click="activeTab = 'credit-card'"
      >
        Credit Card
      </button>
      <button
        class="p-[4px] pb-[12px] font-bold style-headline-3"
        :class="
          activeTab === 'qr-code' ? 'text-white border-b-2 border-blue-100 -mb-px' : 'text-gray-300'
        "
        @click="activeTab = 'qr-code'"
      >
        QR Code
      </button>
    </div>

    <!-- Tab Content -->
    <div class="pt-[24px]">
      <CreditCardForm v-if="activeTab === 'credit-card'" />
      <div v-if="activeTab === 'qr-code'" class="text-gray-300">QR Code</div>
    </div>
  </div>
</template>
