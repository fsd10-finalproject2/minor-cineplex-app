<script setup lang="ts">
import StepperBar from '@/components/ui/step-component/StepperBar.vue'
import PaymentTabs from './PaymentTabs.vue'
import BookingSummary from './BookingSummary.vue'

const currentSteps = [
  { label: 'Select showtime', status: 'completed' as const },
  { label: 'Select seat', status: 'completed' as const },
  { label: 'Payment', status: 'active' as const },
]

// Mock data - replace with real data later
const movie = {
  title: 'The Dark Knight',
  tags: ['Action', 'Crime'],
  posterEmoji: '🦇',
}

const booking = {
  cinema: 'Minor Cineplex Arkham',
  date: '24 Jun 2024',
  time: '16:30',
  theater: 'Hall 1',
}

const seats = ['C-4', 'C-5']
const paymentMethod = 'Credit Card'
const totalPrice = 300
</script>

<template>
  <section
    class="w-full bg-gray-0 flex items-center justify-center border-b border-white/5 h-[102px]"
  >
    <StepperBar :steps="currentSteps" />
  </section>
  <main>
    <div class="flex flex-row py-[80px] px-[120px]">
      <div class="flex flex-2 h-[200px] w-[200px]">
        <PaymentTabs />
        <BookingSummary
          :movie="movie"
          :booking="booking"
          :seats="seats"
          :paymentMethod="paymentMethod"
          :totalPrice="totalPrice"
        />
      </div>
      <div class="flex flex-1 h-[200px] w-[200px]"></div>
    </div>
  </main>
</template>
