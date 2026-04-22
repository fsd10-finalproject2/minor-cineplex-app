<script setup lang="ts">
import Modal from '@/components/ui/modal/Modal.vue'
import type { ModalAction } from '@/components/ui/modal/Modal.vue'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  movieTitle: string
  cinema: string
  date: string
  time: string
  seats: string[]
  totalAmount: number
  discountAmount?: number
  isProcessing?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const finalAmount = computed(() => {
  return props.totalAmount - (props.discountAmount || 0)
})

const actions = computed<ModalAction[]>(() => [
  {
    id: 'cancel',
    label: 'Cancel',
    variant: 'secondary',
    closeOnClick: true,
    handler: () => emit('cancel'),
  },
  {
    id: 'confirm',
    label: props.isProcessing ? 'Processing...' : 'Confirm',
    variant: 'primary',
    closeOnClick: false,
    disabled: props.isProcessing,
    handler: () => emit('confirm'),
  },
])

function onUpdateModelValue(value: boolean) {
  emit('update:modelValue', value)
  if (!value) {
    emit('cancel')
  }
}
</script>

<template>
  <Modal
    :model-value="modelValue"
    title="Confirm booking"
    size="md"
    :persistent="isProcessing"
    :show-close-button="!isProcessing"
    :actions="actions"
    @update:model-value="onUpdateModelValue"
  >
    <div class="flex flex-col gap-4 text-left">
      <div class="space-y-2">
        <p class="text-gray-300 text-sm">Movie</p>
        <p class="text-white font-medium">{{ movieTitle }}</p>
      </div>

      <div class="space-y-2">
        <p class="text-gray-300 text-sm">Cinema</p>
        <p class="text-white font-medium">{{ cinema }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <p class="text-gray-300 text-sm">Date</p>
          <p class="text-white font-medium">{{ date }}</p>
        </div>
        <div class="space-y-2">
          <p class="text-gray-300 text-sm">Time</p>
          <p class="text-white font-medium">{{ time }}</p>
        </div>
      </div>

      <div class="space-y-2">
        <p class="text-gray-300 text-sm">Seats</p>
        <p class="text-white font-medium">{{ seats.join(', ') }}</p>
      </div>

      <div class="border-t border-gray-200/20 pt-4 space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-300">Subtotal</span>
          <span class="text-white">THB {{ totalAmount.toLocaleString() }}</span>
        </div>
        <div v-if="discountAmount && discountAmount > 0" class="flex justify-between">
          <span class="text-gray-300">Discount</span>
          <span class="text-green-400">-THB {{ discountAmount.toLocaleString() }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold">
          <span class="text-white">Total</span>
          <span class="text-blue-100">THB {{ finalAmount.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </Modal>
</template>
