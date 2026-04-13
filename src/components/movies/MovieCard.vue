<script setup lang="ts">
import { CalendarIcon, ClockFillIcon } from '@/assets/icons'
import type { Movie } from '@/services/api/movie.api'

defineProps<{
  movie: Movie
}>()
</script>

<template>
  <div class="movie-card group flex flex-col bg-gray-100 rounded-xl overflow-hidden border border-white/5 hover:border-blue-100/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-100/10">
    <!-- Poster Container -->
    <div class="relative aspect-[2/3] overflow-hidden">
      <img
        :src="movie.posterUrl"
        :alt="movie.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <!-- Rating Badge -->
      <div class="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-white style-body-3 border border-white/10 uppercase font-bold">
        {{ movie.rating }}
      </div>

      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-gray-0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <button class="w-full py-2 bg-blue-100 text-white rounded-lg style-button hover:bg-blue-200 transition-colors">
          View Detail
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col gap-2">
      <h3 class="style-headline-4 text-white line-clamp-1 group-hover:text-blue-100 transition-colors">
        {{ movie.title }}
      </h3>

      <div class="flex flex-wrap gap-2">
        <span v-for="genre in movie.genres" :key="genre" class="px-2 py-0.5 bg-white/5 rounded text-gray-400 style-body-3">
          {{ genre }}
        </span>
      </div>

      <div class="mt-2 flex items-center justify-between text-gray-400">
        <div class="flex items-center gap-1 style-body-3">
          <ClockFillIcon class="size-3 text-blue-100" />
          {{ movie.durationMinutes }}m
        </div>
        <div class="flex items-center gap-1 style-body-3">
          <CalendarIcon class="size-3 text-blue-100" />
          {{ movie.releaseDate }}
        </div>
      </div>
    </div>
  </div>
</template>
