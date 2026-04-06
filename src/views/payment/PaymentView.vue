<script setup lang="ts">
import StepperBar from '@/components/ui/step-component/StepperBar.vue'
import PaymentTabs from './PaymentTabs.vue'
import MovieDetailCard from '@/components/ui/MovieDetailCard.vue'

const currentSteps = [
  { label: 'Select showtime', status: 'completed' as const },
  { label: 'Select seat', status: 'completed' as const },
  { label: 'Payment', status: 'active' as const },
]
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
        <PaymentTabs />
      </div>
      <MovieDetailCard
        poster-url="https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
        title="The Dark Knight"
        :tags="['Action', 'Crime']"
        language="TH"
        cinema="Minor Cineplex Arkham"
        date="24 Jun 2024"
        time="16:30"
        theater="Theater 1"
        :selected-seats="['C9', 'C10']"
        :total="300"
        :show-timer="true"
        :show-coupon="true"
        :show-payment-method="true"
        payment-method="Credit card"
        coupon-name="Merry March Magic"
        :coupon-discount="50"
      />
    </div>
  </main>
</template>
