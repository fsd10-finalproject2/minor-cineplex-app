<script setup lang="ts">
import { ref } from 'vue'
import MovieFilter from '@/components/movies/MovieFilter.vue'
import SpecialCoupons from '@/components/landing/SpecialCoupons.vue'
import CinemaSection from '@/components/landing/CinemaSection.vue'
import type { MovieSearchParams } from '@/services/api/movie.api'

const searchParams = ref<MovieSearchParams>({
  name: '',
  language: '',
  genre: '',
  city: '',
  releaseDate: '',
})

const handleSearch = () => {
  console.log('Searching with params:', searchParams.value)
  // Search result rendering logic will be implemented by the team
}
</script>

<template>
  <div class="landing-page flex flex-col">
    <!-- Hero / Search Section -->
    <div class="relative w-full bg-[#070c1b] py-12 px-4 md:px-20 flex flex-col items-center justify-center border-b border-white/5">
      <!-- Background Decorative Element (since banner is missing) -->
      <div class="absolute inset-0 bg-gradient-to-b from-blue-100/10 to-transparent opacity-30"></div>
      
      <div class="w-full max-w-7xl z-10 flex flex-col gap-8">
        <div class="flex flex-col gap-2">
           <h1 class="style-headline-2 text-white">Experience <span class="text-blue-100">Cinema</span> Like Never Before</h1>
           <p class="style-body-1-regular text-gray-400">Discover the latest blockbusters and find the perfect showtime.</p>
        </div>

        <MovieFilter 
          v-model="searchParams"
          @search="handleSearch"
        />
      </div>
    </div>

    <!-- Other Sections -->
    <div class="py-12 flex flex-col items-center">
      <SpecialCoupons />
      <CinemaSection />
    </div>

    <!-- Movie List Placeholder -->
    <div class="px-4 md:px-20 py-20 flex flex-col items-center justify-center bg-gray-bg border-t border-white/5">
      <div class="w-full max-w-7xl text-center">
        <p class="style-body-1-regular text-gray-200">Movie list results will be rendered here...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: calc(100vh - 80px); /* Adjust based on navbar height */
}
</style>