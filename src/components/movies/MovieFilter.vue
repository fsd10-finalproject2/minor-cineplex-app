<script setup lang="ts">
import type { MovieSearchParams } from '@/services/api/movie.api'
import { ChevronDownIcon, CalendarIcon, SearchIcon } from '@/assets/icons'

const props = defineProps<{
  modelValue: MovieSearchParams
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: MovieSearchParams): void
  (e: 'search'): void
}>()

const handleInput = (key: keyof MovieSearchParams, value: string) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <div class="movie-filter flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-3 bg-gray-0 p-6 lg:p-4 rounded-xl border border-white/5">

    <!-- Movie Search -->
    <div class="flex-1 flex flex-col gap-2 min-w-0">
      <div class="relative group">
        <select
          :value="modelValue.name"
          @change="(e) => handleInput('name', (e.target as HTMLSelectElement).value)"
          class="w-full bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-white appearance-none focus:outline-none focus:border-blue-100 transition-all cursor-pointer style-body-2-regular"
        >
          <option value="">Movie</option>
          <option value="The Dark Knight">The Dark Knight</option>
          <option value="Inception">Inception</option>
        </select>
        <ChevronDownIcon class="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none group-focus-within:text-blue-100 transition-colors" />
      </div>
    </div>

    <!-- Filters Group (2 columns on mobile) -->
    <div class="grid grid-cols-2 lg:flex lg:flex-row gap-3 flex-[3]">

      <!-- Language -->
      <div class="relative group flex-1 min-w-0">
        <select
          :value="modelValue.language"
          @change="(e) => handleInput('language', (e.target as HTMLSelectElement).value)"
          class="w-full bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-white appearance-none focus:outline-none focus:border-blue-100 transition-all cursor-pointer style-body-2-regular"
        >
          <option value="">Language</option>
          <option value="English">English</option>
          <option value="Thai">Thai</option>
        </select>
        <ChevronDownIcon class="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none group-focus-within:text-blue-100 transition-colors" />
      </div>

      <!-- Genre -->
      <div class="relative group flex-1 min-w-0">
        <select
          :value="modelValue.genre"
          @change="(e) => handleInput('genre', (e.target as HTMLSelectElement).value)"
          class="w-full bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-white appearance-none focus:outline-none focus:border-blue-100 transition-all cursor-pointer style-body-2-regular"
        >
          <option value="">Genre</option>
          <option value="Action">Action</option>
          <option value="Adventure">Adventure</option>
          <option value="Comedy">Comedy</option>
        </select>
        <ChevronDownIcon class="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none group-focus-within:text-blue-100 transition-colors" />
      </div>

      <!-- City -->
      <div class="relative group flex-1 min-w-0">
        <select
          :value="modelValue.city"
          @change="(e) => handleInput('city', (e.target as HTMLSelectElement).value)"
          class="w-full bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-white appearance-none focus:outline-none focus:border-blue-100 transition-all cursor-pointer style-body-2-regular"
        >
          <option value="">City</option>
          <option value="Bangkok">Bangkok</option>
          <option value="Chiang Mai">Chiang Mai</option>
          <option value="Gotham">Gotham</option>
        </select>
        <ChevronDownIcon class="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none group-focus-within:text-blue-100 transition-colors" />
      </div>

      <!-- Release Date -->
      <div class="relative group flex-1 min-w-0">
        <input
          type="date"
          :value="modelValue.releaseDate"
          @input="(e) => handleInput('releaseDate', (e.target as HTMLInputElement).value)"
          class="w-full bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-white focus:outline-none focus:border-blue-100 transition-all cursor-pointer style-body-2-regular"
        />
        <CalendarIcon class="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none group-focus-within:text-blue-100 transition-colors bg-gray-100" />
      </div>
    </div>

    <!-- Search Button -->
    <div class="flex justify-center lg:block">
      <button
        @click="emit('search')"
        class="w-[70px] h-[58px] lg:w-[60px] lg:h-[48px] bg-blue-100 hover:bg-blue-200 rounded-md flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-blue-100/20"
      >
        <SearchIcon class="size-6 text-white" />
      </button>
    </div>

  </div>
</template>

<style scoped>
/* Hide the default date icon to show our custom calendar icon */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  cursor: pointer;
  position: absolute;
  right: 0;
  width: 40px;
  height: 100%;
}
</style>
