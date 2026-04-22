<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import StepperBar from '@/components/ui/step-component/StepperBar.vue'
import PaymentTabs from './PaymentTabs.vue'
import MovieDetailCard from '@/components/ui/MovieDetailCard.vue'
import ConfirmBookingModal from '@/components/payment/ConfirmBookingModal.vue'
import { useBookingStore } from '@/stores/booking'
import { useStripePayment, type CardData } from '@/composables/useStripePayment'
import { useToast } from '@/composables/useToast'
import type { CouponSelected } from '@/types/coupon'

const router = useRouter()
const bookingStore = useBookingStore()
const { addToast } = useToast()
const {
  status: paymentStatus,
  error: paymentError,
  paymentIntent,
  createPaymentIntent,
  processPayment,
  confirmBookingPayment,
  resetPayment,
} = useStripePayment()

const currentSteps = [
  { label: 'Select showtime', status: 'completed' as const },
  { label: 'Select seat', status: 'completed' as const },
  { label: 'Payment', status: 'active' as const },
]

// Payment tabs ref
const paymentTabsRef = ref<InstanceType<typeof PaymentTabs> | null>(null)

// Form state
const activePaymentTab = ref<'credit-card' | 'qr-code'>('credit-card')
const cardFormData = ref<CardData>({
  cardNumber: '',
  cardOwner: '',
  expiry: '',
  cvc: '',
})
const isCardFormValid = ref(false)

// Coupon state from MovieDetailCard
const selectedCoupon = ref<CouponSelected | null>(null)
const discountAmount = ref(0)
const finalTotal = ref(bookingStore.totalPrice)

// Modal state
const showConfirmModal = ref(false)
const isProcessing = ref(false)

// Mock booking data (in real app, this comes from the booking store)
const bookingData = computed(() => ({
  posterUrl: bookingStore.showtime?.posterUrl || 'https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  title: bookingStore.showtime?.title || 'The Dark Knight',
  tags: bookingStore.showtime?.tags || ['Action', 'Crime'],
  language: bookingStore.showtime?.language || 'TH',
  cinema: bookingStore.showtime?.cinema || 'Minor Cineplex Arkham',
  date: bookingStore.showtime?.date || '24 Jun 2024',
  time: bookingStore.showtime?.time || '16:30',
  theater: bookingStore.showtime?.theater || 'Theater 1',
  selectedSeats: bookingStore.selectedSeats.length > 0 ? bookingStore.selectedSeats : ['C9', 'C10'],
  total: bookingStore.totalPrice || 300,
}))

const paymentMethodLabel = computed(() => {
  return activePaymentTab.value === 'credit-card' ? 'Credit card' : 'QR Code'
})

// Handle Next button click from MovieDetailCard
async function handleNext() {
  if (activePaymentTab.value === 'credit-card') {
    // Validate card form
    const creditCardForm = paymentTabsRef.value?.creditCardFormRef
    if (creditCardForm && !creditCardForm.validateAll()) {
      addToast({
        title: 'Invalid card details',
        description: 'Please check your card information',
        variant: 'error',
      })
      return
    }
  }

  // Show confirmation modal
  showConfirmModal.value = true
}

// Handle payment confirmation
async function handleConfirmPayment() {
  isProcessing.value = true

  try {
    // Step 1: Create payment intent on backend
    // In real app, use actual showtime ID and seat IDs from the store
    const showtimeId = 1 // Mock - should come from bookingStore
    const seatIds = [1, 2] // Mock - should come from bookingStore

    const intentResponse = await createPaymentIntent(
      showtimeId,
      seatIds,
      selectedCoupon.value?.id || null,
    )

    if (!intentResponse) {
      throw new Error(paymentError.value || 'Failed to create payment')
    }

    // Store booking info for success page
    bookingStore.setBookingResult({
      bookingId: intentResponse.bookingId,
      amount: intentResponse.amount / 100,
      discountAmount: intentResponse.discountAmount / 100,
      finalAmount: intentResponse.finalAmount / 100,
    })

    if (activePaymentTab.value === 'credit-card') {
      // Step 2: Process card payment with Stripe
      const result = await processPayment(cardFormData.value)

      if (!result.success || !result.paymentIntentId) {
        throw new Error(paymentError.value || 'Payment failed')
      }

      // Step 3: Confirm payment on backend
      const confirmed = await confirmBookingPayment(
        intentResponse.bookingId,
        result.paymentIntentId,
      )

      if (!confirmed) {
        throw new Error('Failed to confirm booking')
      }
    } else {
      // QR Code - simulate successful payment for demo
      // In production, this would wait for webhook confirmation
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate confirming with a mock payment intent ID
      await confirmBookingPayment(
        intentResponse.bookingId,
        paymentIntent.value?.clientSecret?.split('_secret_')[0] || 'pi_simulated',
      )
    }

    // Success - navigate to success page
    showConfirmModal.value = false
    addToast({
      title: 'Payment successful!',
      description: 'Your booking has been confirmed',
      variant: 'success',
    })

    router.push('/payment/success')
  } catch (error) {
    console.error('Payment error:', error)
    addToast({
      title: 'Payment failed',
      description: error instanceof Error ? error.message : 'Something went wrong',
      variant: 'error',
    })
  } finally {
    isProcessing.value = false
  }
}

// Handle modal cancel
function handleCancelPayment() {
  showConfirmModal.value = false
  resetPayment()
}

// Handle QR code simulate payment
async function handleSimulateQrPayment() {
  showConfirmModal.value = true
}

// Handle coupon updates from MovieDetailCard
function handleCouponUpdate(coupon: CouponSelected | null) {
  selectedCoupon.value = coupon
}

function handleDiscountUpdate(amount: number) {
  discountAmount.value = amount
}

function handleFinalTotalUpdate(total: number) {
  finalTotal.value = total
}
</script>

<template>
  <section
    class="w-full bg-gray-0 flex items-center justify-center border-b border-white/5 h-[102px]"
  >
    <StepperBar :steps="currentSteps" />
  </section>
  <main>
    <div class="flex flex-row py-[80px] px-[120px] gap-[102px]">
      <div class="flex-1">
        <PaymentTabs
          ref="paymentTabsRef"
          :amount="finalTotal"
          :is-processing="isProcessing"
          @update:active-tab="(tab) => activePaymentTab = tab"
          @update:card-form-data="(data) => cardFormData = data"
          @update:card-form-valid="(valid) => isCardFormValid = valid"
          @simulate-qr-payment="handleSimulateQrPayment"
        />
      </div>
      <MovieDetailCard
        :poster-url="bookingData.posterUrl"
        :title="bookingData.title"
        :tags="bookingData.tags"
        :language="bookingData.language"
        :cinema="bookingData.cinema"
        :date="bookingData.date"
        :time="bookingData.time"
        :theater="bookingData.theater"
        :selected-seats="bookingData.selectedSeats"
        :total="bookingData.total"
        :show-timer="true"
        :show-coupon="true"
        :show-payment-method="true"
        :show-next-button="true"
        :payment-method="paymentMethodLabel"
        @next="handleNext"
        @update:selected-coupon="handleCouponUpdate"
        @update:discount-amount="handleDiscountUpdate"
        @update:final-total="handleFinalTotalUpdate"
      />
    </div>
  </main>

  <!-- Confirm Booking Modal -->
  <ConfirmBookingModal
    v-model="showConfirmModal"
    :movie-title="bookingData.title"
    :cinema="bookingData.cinema"
    :date="bookingData.date"
    :time="bookingData.time"
    :seats="bookingData.selectedSeats"
    :total-amount="bookingData.total"
    :discount-amount="discountAmount"
    :is-processing="isProcessing"
    @confirm="handleConfirmPayment"
    @cancel="handleCancelPayment"
  />
</template>
