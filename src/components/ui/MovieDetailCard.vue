<script setup lang="ts">
import { CalendarIcon, ClockLineIcon, ShopIcon, PinIcon } from '@/assets/icons'
import CustomTag from '@/components/ui/CustomTag.vue'

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
  paymentMethod?: string
  couponName?: string
  couponDiscount?: number
}

withDefaults(defineProps<bookingCard>(), {
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
  paymentMethod: '',
  couponName: '',
  couponDiscount: 0,
})
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

    <!-- Divider -->
    <div
      v-if="selectedSeats.length > 0 || showPaymentMethod || showCoupon"
      class="border-t border-gray-100/10"
    />

    <!-- Price Summary -->
    <div
      v-if="selectedSeats.length > 0 || showPaymentMethod || showCoupon || total > 0"
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

      <!-- Coupon -->
      <div v-if="showCoupon && couponDiscount > 0" class="flex justify-between text-sm">
        <span class="text-gray-300">Coupon</span>
        <span class="text-red-400 font-medium">-THB{{ couponDiscount }}</span>
      </div>

      <!-- Total -->
      <div
        v-if="total > 0"
        class="flex justify-between text-sm font-bold pt-2 border-t border-gray-100/10"
      >
        <span class="text-white">Total</span>
        <span class="text-white">THB{{ total }}</span>
      </div>
    </div>
  </div>
</template>
