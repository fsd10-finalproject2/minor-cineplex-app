<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MovieFilter from '@/components/movies/MovieFilter.vue'
import MovieCard from '@/components/movies/MovieCard.vue'
import SpecialCoupons from '@/components/landing/SpecialCoupons.vue'
import CinemaSection from '@/components/landing/CinemaSection.vue'
import type { MovieSearchParams, Movie } from '@/services/api/movie.api'
import { movieApi } from '@/services/api/movie.api'

const searchParams = ref<MovieSearchParams>({
  name: '',
  language: '',
  genre: '',
  city: '',
  releaseDate: '',
  wheelchairAccess: false,
  hearingAssistance: false,
})

const movies = ref<Movie[]>([])
const isSearching = ref(false)
const hasSearched = ref(false)

const handleSearch = async () => {
  isSearching.value = true
  hasSearched.value = true
  try {
    const results = await movieApi.filterMovies(searchParams.value)
    movies.value = results
  } catch (error) {
    console.error('Failed to search movies:', error)
  } finally {
    isSearching.value = false
  }
}

onMounted(async () => {
  // Initial load
  try {
    const results = await movieApi.getMovies()
    movies.value = results
  } catch (error) {
    console.error('Failed to fetch movies:', error)
  }
})
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

    <!-- Movie List Section -->
    <div class="px-4 md:px-20 py-16 flex flex-col items-center bg-gray-bg border-t border-white/5 min-h-[400px]">
      <div class="w-full max-w-7xl flex flex-col gap-8">
        <div class="flex justify-between items-center">
          <h2 class="style-headline-3 text-white">
            {{ hasSearched ? 'Search Results' : 'Now Showing' }}
            <span v-if="movies.length > 0" class="text-gray-400 ml-2 style-body-2-regular">({{ movies.length }})</span>
          </h2>
        </div>

        <div v-if="isSearching" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-100"></div>
        </div>

        <div v-else-if="movies.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MovieCard 
            v-for="movie in movies" 
            :key="movie.id" 
            :movie="movie" 
          />
        </div>

        <div v-else-if="hasSearched" class="text-center py-20">
          <p class="style-body-1-regular text-gray-400">No movies found matching your criteria.</p>
          <button @click="handleSearch" class="mt-4 text-blue-100 hover:underline">Clear filters and try again</button>
        </div>
        
        <div v-else class="text-center py-20">
          <p class="style-body-1-regular text-gray-400">Loading movies...</p>
        </div>
      </div>
    </div>

    <!-- Other Sections -->
    <div class="py-12 flex flex-col items-center">
      <SpecialCoupons />
      <CinemaSection />
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: calc(100vh - 80px); /* Adjust based on navbar height */
}
</style>