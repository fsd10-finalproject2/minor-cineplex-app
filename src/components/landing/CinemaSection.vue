<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import CinemaCard from '@/components/ui/CinemaCard.vue'
import { DoneIcon } from '@/assets/icons'
import { cinemaApi, type CinemaResponse } from '@/services/api/cinema.api'
import { useGeolocation } from '@vueuse/core'

const { coords, resume, pause } = useGeolocation()
const cinemas = ref<CinemaResponse[]>([])
const isLoading = ref(false)
const viewMode = ref<'city' | 'nearest'>('nearest')

const fetchCinemas = async () => {
  isLoading.value = true
  try {
    const lat = viewMode.value === 'nearest' ? coords.value.latitude : undefined
    const lng = viewMode.value === 'nearest' ? coords.value.longitude : undefined
    
    // If coords are default (Infinity/pending), we should wait or skip
    const items = await cinemaApi.getAll(
      lat === Infinity ? undefined : lat,
      lng === Infinity ? undefined : lng
    )
    cinemas.value = items
  } catch (error) {
    console.error('Failed to fetch cinemas:', error)
  } finally {
    isLoading.value = false
  }
}

const groupedCinemas = computed(() => {
  const groups: Record<string, CinemaResponse[]> = {}
  cinemas.value.forEach(cinema => {
    const city = cinema.city || 'Other'
    if (!groups[city]) {
      groups[city] = []
    }
    groups[city].push(cinema)
  })
  return groups
})

// Dynamic city list from data
const cities = computed(() => {
  return [...new Set(cinemas.value.map(c => c.city))].sort()
})

watch(viewMode, (newMode) => {
  if (newMode === 'nearest') {
    resume()
  } else {
    pause()
  }
  fetchCinemas()
})

// Specifically watch coordinates for the first time they become valid
let hasFetchedValidCoords = false;

watch(coords, (newCoords) => {
  if (viewMode.value === 'nearest' && newCoords.latitude !== Infinity) {
    if (!hasFetchedValidCoords) {
      hasFetchedValidCoords = true;
      fetchCinemas()
    }
  }
}, { deep: true })

onMounted(() => {
  if (viewMode.value !== 'nearest') {
     pause() // Start paused if not in nearest mode
  }
  fetchCinemas()
})
</script>

<template>
  <section class="flex flex-col items-center gap-10 py-10 xl:py-20 w-full px-4 overflow-hidden">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center w-full xl:w-[1200px] gap-4">
      <h2 class="style-headline-2 text-white">All cinemas</h2>
      
      <!-- Toggle Group -->
      <div class="flex bg-gray-100/10 rounded overflow-hidden h-9 border border-white/5">
        <button 
          @click="viewMode = 'city'"
          class="flex items-center gap-2 px-4 transition-all duration-200"
          :class="viewMode === 'city' ? 'bg-[#3b415a] text-white' : 'text-gray-300 hover:text-white'"
        >
          <DoneIcon v-if="viewMode === 'city'" class="size-4" />
          <span class="style-body-2-medium">Browse by City</span>
        </button>
        <button 
          @click="viewMode = 'nearest'"
          class="flex items-center gap-2 px-4 transition-all duration-200"
          :class="viewMode === 'nearest' ? 'bg-[#3b415a] text-white' : 'text-gray-300 hover:text-white'"
        >
          <DoneIcon v-if="viewMode === 'nearest'" class="size-4" />
          <span class="style-body-2-medium">Nearest Locations First</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="w-full xl:w-[1200px]">
      <div v-if="isLoading" class="flex justify-center py-20">
         <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-100"></div>
      </div>
      
      <div v-else>
        <!-- Grouped by City View -->
        <div v-if="viewMode === 'city' && cities.length > 0" class="flex flex-col gap-10">
          <div v-for="city in cities" :key="city" class="flex flex-col gap-4">
            <h3 class="style-headline-3 text-gray-300">{{ city }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CinemaCard 
                v-for="cinema in groupedCinemas[city]" 
                :key="cinema.id"
                :name="cinema.name"
                :address="cinema.address"
                :distance="cinema.distance ? (cinema.distance.toFixed(2) + ' km') : undefined"
              />
            </div>
          </div>
        </div>

        <!-- Nearest / Flat List View -->
        <div v-else-if="cinemas.length > 0" class="flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CinemaCard 
              v-for="cinema in cinemas" 
              :key="cinema.id"
              :name="cinema.name"
              :address="cinema.address"
              :distance="cinema.distance ? (cinema.distance.toFixed(2) + ' km') : undefined"
            />
          </div>
        </div>

        <div v-else class="text-center py-20 text-gray-400">
          No cinemas found.
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Specific color from screenshot for active toggle state */
.bg-\[\#3b415a\] {
  background-color: #3b415a;
}
</style>
