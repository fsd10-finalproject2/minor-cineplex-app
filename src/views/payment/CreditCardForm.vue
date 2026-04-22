<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput/BaseInput.vue'
import type { InputState } from '@/types/baseInput'

export interface CardFormData {
  cardNumber: string
  cardOwner: string
  expiry: string
  cvc: string
}

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:formData': [data: CardFormData]
  'update:isValid': [valid: boolean]
}>()

const cardNumber = ref('')
const cardOwner = ref('')
const expiry = ref('')
const cvc = ref('')

const touched = ref({
  cardNumber: false,
  cardOwner: false,
  expiry: false,
  cvc: false,
})

// Validation functions
function validateCardNumber(value: string): string | null {
  const cleaned = value.replace(/\s/g, '')
  if (!cleaned) return 'Card number is required'
  if (!/^\d{13,19}$/.test(cleaned)) return 'Invalid card number'
  return null
}

function validateCardOwner(value: string): string | null {
  if (!value.trim()) return 'Card owner name is required'
  if (value.trim().length < 2) return 'Name is too short'
  return null
}

function validateExpiry(value: string): string | null {
  if (!value) return 'Expiry date is required'
  const match = value.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return 'Use MM/YY format'
  const month = parseInt(match[1], 10)
  const year = parseInt(match[2], 10) + 2000
  if (month < 1 || month > 12) return 'Invalid month'
  const now = new Date()
  const expiryDate = new Date(year, month - 1)
  if (expiryDate < now) return 'Card has expired'
  return null
}

function validateCvc(value: string): string | null {
  if (!value) return 'CVC is required'
  if (!/^\d{3,4}$/.test(value)) return 'Invalid CVC'
  return null
}

// Computed validation states
const cardNumberError = computed(() => touched.value.cardNumber ? validateCardNumber(cardNumber.value) : null)
const cardOwnerError = computed(() => touched.value.cardOwner ? validateCardOwner(cardOwner.value) : null)
const expiryError = computed(() => touched.value.expiry ? validateExpiry(expiry.value) : null)
const cvcError = computed(() => touched.value.cvc ? validateCvc(cvc.value) : null)

const cardNumberState = computed<InputState>(() => cardNumberError.value ? 'error' : 'default')
const cardOwnerState = computed<InputState>(() => cardOwnerError.value ? 'error' : 'default')
const expiryState = computed<InputState>(() => expiryError.value ? 'error' : 'default')
const cvcState = computed<InputState>(() => cvcError.value ? 'error' : 'default')

const isValid = computed(() => {
  return !validateCardNumber(cardNumber.value) &&
         !validateCardOwner(cardOwner.value) &&
         !validateExpiry(expiry.value) &&
         !validateCvc(cvc.value)
})

// Format card number with spaces
function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '')
  const groups = cleaned.match(/.{1,4}/g)
  return groups ? groups.join(' ') : cleaned
}

function onCardNumberInput(value: string) {
  cardNumber.value = formatCardNumber(value)
}

function onExpiryInput(value: string) {
  let cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
  }
  expiry.value = cleaned
}

function onCvcInput(value: string) {
  cvc.value = value.replace(/\D/g, '').substring(0, 4)
}

// Emit form data on changes
watch([cardNumber, cardOwner, expiry, cvc], () => {
  emit('update:formData', {
    cardNumber: cardNumber.value.replace(/\s/g, ''),
    cardOwner: cardOwner.value,
    expiry: expiry.value,
    cvc: cvc.value,
  })
  emit('update:isValid', isValid.value)
}, { immediate: true })

// Expose validation method for parent
function validateAll(): boolean {
  touched.value = {
    cardNumber: true,
    cardOwner: true,
    expiry: true,
    cvc: true,
  }
  return isValid.value
}

defineExpose({ validateAll, isValid })
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Row 1: Card Number & Card Owner -->
    <div class="flex gap-4">
      <div class="flex-1">
        <BaseInput
          :model-value="cardNumber"
          label="Card Number"
          placeholder="4242 4242 4242 4242"
          :show-left-icon="false"
          :show-right-icon="false"
          :state="cardNumberState"
          :help-text="cardNumberError || ''"
          :disabled="disabled"
          @update:model-value="onCardNumberInput"
          @blur="touched.cardNumber = true"
        />
      </div>
      <div class="flex-1">
        <BaseInput
          v-model="cardOwner"
          label="Card Owner"
          placeholder="John Doe"
          :show-left-icon="false"
          :show-right-icon="false"
          :state="cardOwnerState"
          :help-text="cardOwnerError || ''"
          :disabled="disabled"
          @blur="touched.cardOwner = true"
        />
      </div>
    </div>
    <!-- Row 2: Expiry Date & CVC -->
    <div class="flex gap-4">
      <div class="flex-1">
        <BaseInput
          :model-value="expiry"
          label="Expiry Date"
          placeholder="MM/YY"
          :show-left-icon="false"
          :show-right-icon="false"
          :state="expiryState"
          :help-text="expiryError || ''"
          :disabled="disabled"
          @update:model-value="onExpiryInput"
          @blur="touched.expiry = true"
        />
      </div>
      <div class="flex-1">
        <BaseInput
          :model-value="cvc"
          label="CVC"
          placeholder="123"
          :show-left-icon="false"
          :show-right-icon="false"
          :state="cvcState"
          :help-text="cvcError || ''"
          :disabled="disabled"
          @update:model-value="onCvcInput"
          @blur="touched.cvc = true"
        />
      </div>
    </div>
    <!-- Test card hint -->
    <p class="text-gray-400 text-xs mt-2">
      Test card: 4242 4242 4242 4242, any future date, any 3-digit CVC
    </p>
  </div>
</template>
