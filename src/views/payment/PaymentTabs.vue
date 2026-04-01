<script setup lang="ts">
import { ref } from 'vue'
const activeTab = ref<'credit-card' | 'qr-code'>('credit-card')
</script>

<template>
  <div class="flex gap-[16px]">
    <div>
      <button
        class="p-[4px] font-bold style-headline-3"
        :class="
          activeTab === 'credit-card'
            ? 'text-white border-b-1 border-gray-200 -mb-px'
            : 'text-gray-300'
        "
        @click="activeTab = 'credit-card'"
      >
        Credit Card
      </button>
    </div>
    <div>
      <button
        class="p-[4px] font-bold style-headline-3"
        :class="
          activeTab === 'qr-code' ? 'text-white border-b-1 border-gray-200 -mb-px' : 'text-gray-300'
        "
        @click="activeTab = 'qr-code'"
      >
        QR Code
      </button>
    </div>
  </div>
</template>
