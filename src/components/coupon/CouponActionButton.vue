<script setup lang="ts">
import CustomButton from '@/components/ui/CustomButton.vue'

defineProps<{
  isGetCoupon: boolean
  isLoggedIn: boolean
  isSavingCoupon: boolean
  buttonClass: string
}>()

const emit = defineEmits<{
  clickGetCoupon: [event: MouseEvent]
}>()

function onClickGetCoupon(event: MouseEvent) {
  emit('clickGetCoupon', event)
}
</script>

<template>
  <CustomButton
    v-if="isGetCoupon && isLoggedIn"
    variant="secondary"
    :class="buttonClass"
    type="button"
  >
    View details
  </CustomButton>
  <CustomButton
    v-else
    variant="primary"
    :class="buttonClass"
    type="button"
    :disabled="isSavingCoupon"
    @click="onClickGetCoupon"
  >
    {{ isSavingCoupon ? 'Saving...' : 'Get coupon' }}
  </CustomButton>
</template>
