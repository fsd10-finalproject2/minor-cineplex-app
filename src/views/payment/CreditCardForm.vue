<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput/BaseInput.vue'

const cardNumber = ref('')
const cardOwner = ref('')
const expiry = ref('')
const cvc = ref('')
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Row 1: Card Number & Card Owner -->
    <div class="flex gap-4">
      <div class="flex-1">
        <BaseInput
          v-model="cardNumber"
          label="Card Number"
          placeholder="1234 5678 9012 3456"
          :show-left-icon="false"
          :show-right-icon="false"
        />
      </div>
      <div class="flex-1">
        <BaseInput
          v-model="cardOwner"
          label="Card Owner"
          placeholder="John Doe"
          :show-left-icon="false"
          :show-right-icon="false"
        />
      </div>
    </div>
    <!-- Row 2: Expiry Date & CVC -->
    <div class="flex gap-4">
      <div class="flex-1">
        <BaseInput
          v-model="expiry"
          label="Expiry Date"
          placeholder="MM/YY"
          :show-left-icon="false"
          :show-right-icon="false"
        />
      </div>
      <div class="flex-1">
        <BaseInput
          v-model="cvc"
          label="CVC"
          placeholder="123"
          :show-left-icon="false"
          :show-right-icon="false"
        />
      </div>
    </div>
  </div>
</template>
