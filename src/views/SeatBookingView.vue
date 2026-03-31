<script setup lang="ts">
import StepperBar from '@/components/ui/step-component/StepperBar.vue'
import SeatIcon from '@/components/ui/SeatIcon.vue'
import { CalendarIcon, ClockLineIcon, ShopIcon, NoteBookIcon } from '@/assets/icons'
import CustomTag from '@/components/ui/CustomTag.vue'

// --- Progress Steps ---
const currentSteps = [
  { label: 'Select showtime', status: 'completed' as const },
  { label: 'Select seat', status: 'active' as const },
  { label: 'Payment', status: 'inactive' as const },
]

// --- Mock Theater Data (Grid E-A, Left-Right Columns) ---
const rows = ['E', 'D', 'C', 'B', 'A']

const generateMockStatus = (row: string, num: number) => {
  if ((row === 'A' || row === 'B') && num > 7) return 'booked'
  if (row === 'C' && (num === 3 || num === 4)) return 'reserved'
  if (row === 'E' && num === 3) return 'booked'
  return 'available'
}
</script>

<template>
  <div class="booking-page min-h-screen">
    <!-- Section 2: Progress Section (Stepper) -->
    <section class="progress-section bg-[#070C1B] flex items-center justify-center">
      <StepperBar :steps="currentSteps" />
    </section>

    <!-- Section 3: Main Core (Seat Booking) -->
    <main class="booking-core max-w-[1440px] mx-auto px-[120px] py-[80px] flex gap-[102px]">
      
      <!-- Left: Seat Selector -->
      <div class="flex-1">
        <!-- The Screen -->
        <div class="mb-16">
          <div class="screen-element relative h-12 rounded-t-[40px] bg-linear-to-b from-blue-100/40 to-transparent flex items-center justify-center">
             <span class="style-label text-blue-100/50 uppercase tracking-widest">screen</span>
          </div>
        </div>

        <!-- The Auditorium Grid -->
        <div class="space-y-4 mb-20">
          <div v-for="rowChar in rows" :key="rowChar" class="flex items-center gap-6 justify-center">
            <span class="style-body-2-bold text-gray-300 w-4">{{ rowChar }}</span>
            
            <!-- Left Block of Seats -->
            <div class="flex gap-3">
              <SeatIcon v-for="n in 5" :key="n" :status="generateMockStatus(rowChar, n)" />
            </div>

            <!-- Aisle Spacing -->
            <div class="w-16"></div>

            <!-- Right Block of Seats -->
            <div class="flex gap-3">
              <SeatIcon v-for="n in 5" :key="n + 5" :status="generateMockStatus(rowChar, n + 5)" />
            </div>

            <span class="style-body-2-bold text-gray-300 w-4 text-right">{{ rowChar }}</span>
          </div>
        </div>

        <!-- The Legend Bar -->
        <div class="pt-8 border-t border-gray-100/5 flex items-center gap-12">
           <div class="p-3 px-6 bg-gray-100/10 rounded-lg border border-gray-100/20 style-headline-4">
             Hall 1
           </div>

           <div class="flex gap-8">
             <div class="flex items-center gap-3">
               <SeatIcon status="available" />
               <div class="flex flex-col">
                 <span class="style-body-3 text-gray-300">Available Seat</span>
                 <span class="style-body-2-bold text-blue-100">THB150</span>
               </div>
             </div>
             
             <div class="flex items-center gap-3">
               <SeatIcon status="booked" />
               <span class="style-body-3 text-gray-200">Booked Seat</span>
             </div>

             <div class="flex items-center gap-3">
               <SeatIcon status="reserved" />
               <span class="style-body-3 text-gray-200">Reserved Seat</span>
             </div>
           </div>
        </div>
      </div>

      <!-- Right: Movie Details Sidebar -->
      <aside class="w-[300px] shrink-0 sticky top-32 h-fit">
        <div class="bg-[#0D152B] rounded-xl p-5 border border-gray-100/10 shadow-2xl space-y-6">
          <!-- Poster Thumbnail Mock -->
          <div class="aspect-2/3 bg-gray-100/10 rounded-lg overflow-hidden border border-gray-100/10">
             <div class="w-full h-full flex items-center justify-center text-gray-400">
               Poster Image
             </div>
          </div>

          <div class="space-y-4">
            <h2 class="style-headline-3 leading-tight">The Dark Knight</h2>
            
            <div class="flex gap-2">
              <CustomTag>Action</CustomTag>
              <CustomTag>Crime</CustomTag>
              <CustomTag variant="lang">TH</CustomTag>
            </div>
          </div>

          <div class="pt-4 space-y-4 border-t border-gray-100/5 text-gray-200">
            <div class="flex items-center gap-3.5">
              <ShopIcon class="size-5 text-gray-400" />
              <span class="style-body-3">Minor Cineplex Arkham</span>
            </div>
            <div class="flex items-center gap-3.5">
              <CalendarIcon class="size-5 text-gray-400" />
              <span class="style-body-3">24 Jun 2024</span>
            </div>
            <div class="flex items-center gap-3.5">
              <ClockLineIcon class="size-5 text-gray-400" />
              <span class="style-body-3">16:30</span>
            </div>
            <div class="flex items-center gap-3.5">
              <NoteBookIcon class="size-5 text-gray-400" />
              <span class="style-body-3">Hall 1</span>
            </div>
          </div>
        </div>
      </aside>

    </main>
  </div>
</template>

<style scoped>
.progress-section {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  height: 106px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.booking-core {
  min-height: 730px;
}

.screen-element {
  overflow: hidden;
}
</style>
