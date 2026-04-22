<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CustomButton from '@/components/ui/CustomButton.vue'
import { useBookingStore } from '@/stores/booking'

const router = useRouter()
const bookingStore = useBookingStore()

const bookingResult = computed(() => bookingStore.bookingResult)
const showtime = computed(() => bookingStore.showtime)

function handleBackToHome() {
  bookingStore.clearBooking()
  router.push('/')
}

function handleViewBookings() {
  router.push('/account/booking-history')
}

function handleShare(platform: 'facebook' | 'twitter' | 'copy') {
  const shareText = `I just booked tickets for ${showtime.value?.title || 'a movie'} at ${showtime.value?.cinema || 'Minor Cineplex'}!`
  const shareUrl = window.location.origin

  switch (platform) {
    case 'facebook':
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
        '_blank',
      )
      break
    case 'twitter':
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        '_blank',
      )
      break
    case 'copy':
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      alert('Link copied to clipboard!')
      break
  }
}
</script>

<template>
  <main class="min-h-screen bg-gray-0 flex items-center justify-center p-8">
    <div class="max-w-md w-full text-center">
      <!-- Success Icon -->
      <div class="mb-8">
        <div class="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
          <svg
            class="w-12 h-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <!-- Success Message -->
      <h1 class="style-headline-2 text-white mb-4">Payment Successful!</h1>
      <p class="text-gray-300 mb-8">
        Your booking has been confirmed. You will receive a confirmation email shortly.
      </p>

      <!-- Booking Details -->
      <div v-if="bookingResult || showtime" class="bg-gray-100/5 rounded-lg p-6 mb-8 text-left">
        <h2 class="style-headline-4 text-white mb-4">Booking Details</h2>

        <div v-if="showtime" class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-300">Movie</span>
            <span class="text-white font-medium">{{ showtime.title }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Cinema</span>
            <span class="text-white font-medium">{{ showtime.cinema }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Date</span>
            <span class="text-white font-medium">{{ showtime.date }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Time</span>
            <span class="text-white font-medium">{{ showtime.time }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Theater</span>
            <span class="text-white font-medium">{{ showtime.theater }}</span>
          </div>
        </div>

        <div v-if="bookingResult" class="border-t border-gray-100/20 mt-4 pt-4 space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-300">Booking ID</span>
            <span class="text-white font-medium">#{{ bookingResult.bookingId }}</span>
          </div>
          <div v-if="bookingResult.discountAmount > 0" class="flex justify-between">
            <span class="text-gray-300">Discount</span>
            <span class="text-green-400 font-medium">
              -THB {{ bookingResult.discountAmount.toLocaleString() }}
            </span>
          </div>
          <div class="flex justify-between text-lg font-bold">
            <span class="text-white">Total Paid</span>
            <span class="text-blue-100">
              THB {{ bookingResult.finalAmount.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Share Section -->
      <div class="mb-8">
        <p class="text-gray-300 mb-4">Share your booking</p>
        <div class="flex justify-center gap-4">
          <button
            class="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
            @click="handleShare('facebook')"
          >
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
          </button>
          <button
            class="w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-colors"
            @click="handleShare('twitter')"
          >
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
              />
            </svg>
          </button>
          <button
            class="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 flex items-center justify-center transition-colors"
            @click="handleShare('copy')"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-4">
        <CustomButton label="View My Bookings" variant="primary" class="w-full" @click="handleViewBookings" />
        <CustomButton label="Back to Home" variant="secondary" class="w-full" @click="handleBackToHome" />
      </div>
    </div>
  </main>
</template>
