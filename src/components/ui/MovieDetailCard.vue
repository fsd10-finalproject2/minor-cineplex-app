<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { CalendarIcon, ClockLineIcon, ShopIcon, PinIcon, TicketIcon, XIcon, ChevronRightIcon } from '@/assets/icons'
import CustomTag from '@/components/ui/CustomTag.vue'
import CustomButton from '@/components/ui/CustomButton.vue'
import Modal from '@/components/ui/modal/Modal.vue'
import type { CouponSelected } from '@/types/coupon'
import { couponApi } from '@/services/api/coupon.api'

// Helper to format date
function formatExpiryDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface bookingCard {
  posterUrl: string
  title: string
  tags: string[]
  language: string
  cinema: string
  date: string
  time: string
  theater: string
  selectedSeats?: string[]
  total?: number
  showCoupon?: boolean
  showPaymentMethod?: boolean
  showTimer?: boolean
  showNextButton?: boolean
  paymentMethod?: string
  couponName?: string
  couponDiscount?: number
}

const props = withDefaults(defineProps<bookingCard>(), {
  posterUrl: '',
  title: '',
  tags: () => [],
  language: 'TH',
  cinema: '',
  date: '',
  time: '',
  theater: '',
  selectedSeats: () => [],
  total: 0,
  showCoupon: false,
  showPaymentMethod: false,
  showTimer: false,
  showNextButton: false,
  paymentMethod: '',
  couponName: '',
  couponDiscount: 0,
})

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'update:selectedCoupon', coupon: CouponSelected | null): void
  (e: 'update:discountAmount', amount: number): void
  (e: 'update:finalTotal', total: number): void
}>()

// Coupon state
const selectedCoupon = ref<CouponSelected | null>(null)
const availableCoupons = ref<CouponSelected[]>([])
const showCouponModal = ref(false)
const isLoadingCoupons = ref(false)

// Calculate discount based on selected coupon
const discountAmount = ref(0)

// Final total after discount
const finalTotal = ref(props.total)

// Fetch available coupons on mount
onMounted(async () => {
  if (props.showCoupon) {
    isLoadingCoupons.value = true
    try {
      availableCoupons.value = await couponApi.getAvailableCoupons()
    } finally {
      isLoadingCoupons.value = false
    }
  }
})

watch(
  [selectedCoupon, () => props.total],
  async ([coupon, total]) => {
    if (!coupon || total <= 0) {
      discountAmount.value = 0
      finalTotal.value = total
      emit('update:selectedCoupon', null)
      emit('update:discountAmount', 0)
      emit('update:finalTotal', total)
      return
    }

    const result = await couponApi.calculateDiscount(coupon.id, total)
    if (result.valid) {
      discountAmount.value = result.discount
      finalTotal.value = result.finalTotal
      emit('update:selectedCoupon', coupon)
      emit('update:discountAmount', result.discount)
      emit('update:finalTotal', result.finalTotal)
    } else {
      // Handle error - maybe show message and remove coupon
      alert(result.error)
      selectedCoupon.value = null
    }
  },
  { immediate: true },
)

// Handle coupon selection
function handleSelectCoupon(coupon: CouponSelected) {
  // Validate minimum price
  selectedCoupon.value = coupon
}

// Handle coupon removal
function handleRemoveCoupon() {
  selectedCoupon.value = null
}
</script>

<template>
  <div
    class="bg-gray-0 rounded-lg p-5 border border-gray-100/10 shadow-2xl flex flex-col justify-between w-[305px] h-auto lg:w-[305px] gap-6"
  >
    <!-- Top section: Poster & Title -->
    <div class="flex gap-4">
      <!-- Poster Thumbnail -->
      <div class="w-[88px] h-[128px] rounded overflow-hidden shrink-0 shadow-sm relative">
        <img :src="posterUrl" :alt="title" class="w-full h-full object-cover" />
      </div>

      <div class="flex flex-col gap-2 pt-1">
        <h2 class="style-headline-4 leading-tight text-white mb-1">{{ title }}</h2>
        <div class="flex flex-wrap gap-2">
          <CustomTag v-for="tag in tags" :key="tag">{{ tag }}</CustomTag>
          <CustomTag variant="lang">{{ language }}</CustomTag>
        </div>
      </div>
    </div>

    <!-- Bottom section: Session Details -->
    <div class="space-y-3.5 text-gray-200">
      <div class="flex items-center gap-3.5">
        <PinIcon class="size-5 text-gray-400 shrink-0" />
        <span class="style-body-2 truncate">{{ cinema }}</span>
      </div>
      <div class="flex items-center gap-3.5">
        <CalendarIcon class="size-5 text-gray-400 shrink-0" />
        <span class="style-body-2">{{ date }}</span>
      </div>
      <div class="flex items-center gap-3.5">
        <ClockLineIcon class="size-5 text-gray-400 shrink-0" />
        <span class="style-body-2">{{ time }}</span>
      </div>
      <div class="flex items-center gap-3.5">
        <ShopIcon class="size-5 text-gray-400 shrink-0" />
        <span class="style-body-2">{{ theater }}</span>
      </div>
    </div>

    <!-- Timer -->
    <div v-if="showTimer" class="flex items-center gap-2 text-sm">
      <span class="text-gray-300">Time remaining:</span>
      <span class="text-blue-100 font-medium">04:55</span>
    </div>

    <!-- Coupon Section -->
    <div v-if="showCoupon" class="space-y-3">
      <!-- Divider -->
      <div class="border-t border-gray-100/10" />

      <!-- Coupon Header Row -->
      <button
        type="button"
        class="w-full flex items-center justify-between py-1 hover:opacity-80 transition-opacity"
        @click="showCouponModal = true"
      >
        <span class="text-white text-sm">Coupon</span>
        <ChevronRightIcon class="size-4 text-gray-400" />
      </button>

      <!-- Selected Coupon Display -->
      <div
        v-if="selectedCoupon"
        class="flex items-center justify-between bg-gray-800/60 rounded-md px-3 py-2"
      >
        <span class="text-blue-100 text-xs truncate flex-1 mr-2">
          {{ selectedCoupon.name }}
        </span>
        <button
          type="button"
          class="text-gray-400 hover:text-white transition-colors shrink-0"
          @click="handleRemoveCoupon"
        >
          <XIcon class="size-4" />
        </button>
      </div>
    </div>

    <!-- Price Summary -->
    <div
      v-if="selectedSeats.length > 0 || showPaymentMethod || total > 0"
      class="space-y-3"
    >
      <!-- Selected Seats -->
      <div v-if="selectedSeats.length > 0" class="flex justify-between text-sm">
        <span class="text-gray-300">Selected Seat</span>
        <span class="text-white font-medium">{{ selectedSeats.join(', ') }}</span>
      </div>

      <!-- Payment Method -->
      <div v-if="showPaymentMethod" class="flex justify-between text-sm">
        <span class="text-gray-300">Payment method</span>
        <span class="text-white font-medium">{{ paymentMethod }}</span>
      </div>

      <!-- Coupon Discount -->
      <div v-if="selectedCoupon && discountAmount > 0" class="flex justify-between text-sm">
        <span class="text-gray-300">Coupon</span>
        <span class="text-[#F87171] font-medium">-THB{{ discountAmount }}</span>
      </div>

      <!-- Total -->
      <div v-if="total > 0" class="flex justify-between text-sm font-bold">
        <span class="text-white">Total</span>
        <span class="text-white">THB{{ finalTotal }}</span>
      </div>
    </div>

    <!-- Next Button -->
    <CustomButton
      v-if="showNextButton"
      label="Next"
      variant="primary"
      class="w-full"
      @click="emit('next')"
    />
  </div>

  <!-- Coupon Selection Modal -->
  <Modal
    v-model="showCouponModal"
    title="Select coupon"
    size="lg"
  >
    <div class="space-y-4 max-h-[400px] overflow-y-auto">
      <div v-if="isLoadingCoupons" class="p-8 text-center text-gray-400">
        Loading coupons...
      </div>
      <div v-else-if="availableCoupons.length === 0" class="p-8 text-center text-gray-400">
        No coupons available
      </div>

      <!-- Coupon Cards Grid -->
      <div v-else class="grid grid-cols-2 gap-4">
        <button
          v-for="coupon in availableCoupons"
          :key="coupon.id"
          type="button"
          class="bg-gray-700/30 hover:bg-gray-700/50 rounded-lg overflow-hidden transition-colors text-left"
          @click="handleSelectCoupon(coupon); showCouponModal = false"
        >
          <!-- Coupon Image -->
          <div class="aspect-[16/9] bg-gray-700 relative overflow-hidden">
            <img
              v-if="coupon.couponsImgUrl"
              :src="coupon.couponsImgUrl"
              :alt="coupon.code"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <div class="text-center">
                <span class="text-2xl font-bold text-white">{{ coupon.formattedDiscount }}</span>
                <p class="text-xs text-gray-400 mt-1">OFF</p>
              </div>
            </div>
          </div>

          <!-- Coupon Info -->
          <div class="p-3">
            <p class="text-white text-sm font-medium line-clamp-2 min-h-[40px]">
              {{ coupon.name }}
            </p>
            <p v-if="coupon.expiresAt" class="text-gray-400 text-xs mt-1">
              exp. {{ formatExpiryDate(coupon.expiresAt) }}
            </p>
            <div class="flex items-center gap-1 text-blue-100 text-xs mt-2 hover:underline">
              <span>View details</span>
              <ChevronRightIcon class="size-3" />
            </div>
          </div>
        </button>
      </div>
    </div>
  </Modal>
</template>
