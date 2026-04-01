<script setup lang="ts">
import StepperBar from '@/components/ui/step-component/StepperBar.vue'
import SeatIcon from '@/components/ui/SeatIcon.vue'
import { CalendarIcon, ClockLineIcon, ShopIcon, PinIcon } from '@/assets/icons'
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
    <section class="progress-section bg-[#070C1B] flex items-center justify-center border-b border-white/5">
      <StepperBar :steps="currentSteps" />
    </section>

    <!-- Section 3: Main Core (Seat Booking) -->
    <main class="booking-core max-w-[1440px] mx-auto px-4 lg:px-[120px] py-10 lg:py-[80px] flex flex-col lg:flex-row gap-10 lg:gap-[102px] overflow-x-hidden">

      <!-- Left: Seat Selector -->
      <div class="flex-1 overflow-x-hidden md:flex md:flex-col md:items-center lg:items-stretch">
        <!-- Screen & Grid Wrapper (Responsive) -->
        <div class="w-full max-w-[343px] md:max-w-none mx-auto flex flex-col gap-[28px] md:gap-16 mb-12 md:mb-20">

          <!-- The Screen -->
          <div class="w-full">
            <div class="screen-element relative h-[22px] md:h-12 rounded-t-[40px] bg-linear-to-b from-blue-100/40 to-transparent flex items-center justify-center">
               <span class="style-label text-blue-100/50 uppercase tracking-widest text-[10px] md:text-sm">screen</span>
            </div>
          </div>

          <!-- The Auditorium Grid -->
          <div class="flex flex-col justify-between h-[148px] md:h-auto md:space-y-4 w-full md:items-center">
            <div v-for="rowChar in rows" :key="rowChar" class="flex items-center justify-between md:justify-center md:gap-6 w-full h-[18.66px] md:h-10">
              <!-- Left Row Label -->
              <span class="style-body-2-bold text-gray-300 w-3 md:w-4 text-[10px] md:text-base text-left shrink-0">{{ rowChar }}</span>

              <div class="flex items-center justify-between md:justify-center flex-1 md:flex-none px-1.5 md:px-0 md:gap-16">
                <!-- Left Block of Seats -->
                <div class="flex items-center justify-between w-[46%] md:w-auto md:gap-3">
                  <div v-for="n in 5" :key="n" class="w-[18.66px] h-[18.66px] md:w-10 md:h-10 shrink-0">
                    <SeatIcon :status="generateMockStatus(rowChar, n)" />
                  </div>
                </div>

                <!-- Right Block of Seats -->
                <div class="flex items-center justify-between w-[46%] md:w-auto md:gap-3">
                  <div v-for="n in 5" :key="n + 5" class="w-[18.66px] h-[18.66px] md:w-10 md:h-10 shrink-0">
                    <SeatIcon :status="generateMockStatus(rowChar, n + 5)" />
                  </div>
                </div>
              </div>

              <!-- Right Row Label -->
              <span class="style-body-2-bold text-gray-300 w-3 md:w-4 text-[10px] md:text-base text-right shrink-0">{{ rowChar }}</span>
            </div>
          </div>
        </div>

        <!-- The Legend Bar -->
        <div class="py-4 border-t border-gray-100/5 flex flex-col xl:flex-row items-start xl:items-center gap-6 xl:gap-[40px] w-full xl:max-w-[793px]">
           <div class="w-[88px] h-[54px] px-4 py-3 bg-gray-100/10 rounded border border-gray-100/20 flex items-center justify-center shrink-0">
             <span class="text-gray-400 style-headline-3 bold leading-none whitespace-nowrap">Hall 1</span>
           </div>

           <div class="flex md:flex-row items-start md:items-center gap-6 xl:gap-[40px] flex-wrap">
             <div class="flex items-center gap-3">
               <div class="w-8 h-8 md:w-10 md:h-10 shrink-0">
                 <SeatIcon status="available" />
               </div>
               <div class="flex flex-col">
                 <span class="style-body-2 text-gray-400">Available Seat</span>
                 <span class="style-body-2-bold text-gray-400 leading-tight">THB150</span>
               </div>
             </div>

             <div class="flex items-center gap-3">
               <div class="w-8 h-8 md:w-10 md:h-10 shrink-0">
                 <SeatIcon status="booked" />
               </div>
               <span class="style-body-2 text-gray-400">Booked Seat</span>
             </div>

             <div class="flex items-center gap-3">
               <div class="w-8 h-8 md:w-10 md:h-10 shrink-0">
                 <SeatIcon status="reserved" />
               </div>
               <span class="style-body-2 text-gray-400">Reserved Seat</span>
             </div>
           </div>
        </div>
      </div>

      <!-- Right/Bottom: Movie Details Sidebar -->
      <aside class="w-full max-w-[343px] md:max-w-[400px] lg:max-w-none lg:w-[305px] shrink-0 lg:sticky top-32 mx-auto lg:mx-0">
        <div class="bg-gray-0 rounded-lg p-5 border border-gray-100/10 shadow-2xl flex flex-col justify-between w-full h-auto lg:w-[305px] lg:h-[304px] gap-6 lg:gap-0">

          <!-- Top section: Poster & Title -->
          <div class="flex gap-4">
            <!-- Poster Thumbnail -->
            <div class="w-[88px] h-[128px] rounded overflow-hidden shrink-0 shadow-sm relative">
               <img src="https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg" alt="The Dark Knight" class="w-full h-full object-cover">
            </div>

            <div class="flex flex-col gap-2 pt-1">
              <h2 class="style-headline-4 leading-tight text-white mb-1">The Dark Knight</h2>
              <div class="flex flex-wrap gap-2">
                <CustomTag>Action</CustomTag>
                <CustomTag>Crime</CustomTag>
                <CustomTag variant="lang">TH</CustomTag>
              </div>
            </div>
          </div>

          <!-- Bottom section: Session Details -->
          <div class="space-y-3.5 text-gray-200">
            <div class="flex items-center gap-3.5">
              <PinIcon class="size-5 text-gray-400 shrink-0" />
              <span class="style-body-2 truncate">Minor Cineplex Arkham</span>
            </div>
            <div class="flex items-center gap-3.5">
              <CalendarIcon class="size-5 text-gray-400 shrink-0" />
              <span class="style-body-2">24 Jun 2024</span>
            </div>
            <div class="flex items-center gap-3.5">
              <ClockLineIcon class="size-5 text-gray-400 shrink-0" />
              <span class="style-body-2">16:30</span>
            </div>
            <div class="flex items-center gap-3.5">
              <ShopIcon class="size-5 text-gray-400 shrink-0" />
              <span class="style-body-2">Hall 1</span>
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
  height: 102px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.booking-core {
  min-height: 730px;
}

.screen-element {
  overflow: hidden;
}
</style>
