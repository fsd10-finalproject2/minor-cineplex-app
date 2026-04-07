<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { get, post } from '@/services/api/http'
import StepperBar from '@/components/ui/step-component/StepperBar.vue'
import SeatIcon from '@/components/ui/SeatIcon.vue'
import { CalendarIcon, ClockLineIcon, ShopIcon, PinIcon } from '@/assets/icons'
import CustomTag from '@/components/ui/CustomTag.vue'
import { supabase } from '@/lib/supabase'

// --- Types ---
interface Seat {
  id: number
  row: string
  col: number
  seatNumber: string
  seatType: string
  theaterId: number
}

interface SeatSelection {
  userId: string
  showtimeId: number
  seatId: number
}

interface RealtimeSelectionPayload {
  new: {
    id: number
    user_id: string
    showtime_id: number
    seat_id: number
  }
  old: {
    id: number
  }
}

// --- Configuration ---
const SHOWTIME_ID = 1  // Mock Showtime ID
const THEATER_ID = 1   // Mock Theater ID

// --- Setup ---
const route = useRoute()
const authStore = useAuthStore()
const friendId = route.query.friendId as string | undefined

// --- Progress Steps ---
const currentSteps = [
  { label: 'Select showtime', status: 'completed' as const },
  { label: 'Select seat', status: 'active' as const },
  { label: 'Payment', status: 'inactive' as const },
]

// --- Reactive State ---
const seats = ref<Seat[]>([])
const bookedSeatIds = ref<Set<number>>(new Set()) // Fully booked/paid
const mySelections = ref<Set<number>>(new Set())
const friendSelections = ref<Set<number>>(new Set())
const otherSelections = ref<Set<number>>(new Set())
const loading = ref(true)

// --- Dynamic Grid Logic ---
const rowLabels = computed(() => {
  const uniqRows = [...new Set(seats.value.map(s => s.row))].sort().reverse()
  return uniqRows
})

const getSeatsByRow = (row: string) => {
  return seats.value
    .filter(s => s.row === row)
    .sort((a, b) => a.col - b.col)
}

// --- Status Helpers ---
const getSeatStatus = (seat: Seat) => {
  if (bookedSeatIds.value.has(seat.id)) return 'booked'
  if (friendId && friendSelections.value.has(seat.id)) return 'friend'
  if (mySelections.value.has(seat.id)) return 'selected'
  if (otherSelections.value.has(seat.id)) return 'reserved'
  return 'available'
}

const toggleSeat = async (seat: Seat) => {
  if (bookedSeatIds.value.has(seat.id)) return // Cannot select booked seats
  if (otherSelections.value.has(seat.id)) return // Cannot select others' holds
  if (friendId && friendSelections.value.has(seat.id)) return // Cannot select friend's hold

  const isSelected = mySelections.value.has(seat.id)
  
  try {
    if (isSelected) {
      // Optimistic update
      mySelections.value.delete(seat.id)
      await post('/api/seats/deselect', { showtimeId: SHOWTIME_ID, seatId: seat.id })
    } else {
      // Optimistic update
      mySelections.value.add(seat.id)
      await post('/api/seats/select', { showtimeId: SHOWTIME_ID, seatId: seat.id })
    }
  } catch (err) {
    console.error('Failed to toggle seat:', err)
    // Revert on failure
    if (isSelected) mySelections.value.add(seat.id)
    else mySelections.value.delete(seat.id)
  }
}

// --- Data Fetching & Real-Time ---
const fetchInitialData = async () => {
  loading.value = true
  try {
    // 1. Fetch Seats from backend
    seats.value = await get<Seat[]>(`/api/seats/theater/${THEATER_ID}`)

    // 2. Fetch current active selections from backend
    const currentSelections = await get<SeatSelection[]>(`/api/seats/selections/${SHOWTIME_ID}`)
    
    // Sort selections into My, Friend, Other
    const myId = authStore.user?.userId
    
    mySelections.value.clear()
    friendSelections.value.clear()
    otherSelections.value.clear()

    currentSelections.forEach(selection => {
      if (myId && selection.userId === myId) {
        mySelections.value.add(selection.seatId)
      } else if (friendId && selection.userId === friendId) {
        friendSelections.value.add(selection.seatId)
      } else {
        otherSelections.value.add(selection.seatId)
      }
    })

    // 3. For booked seats (Tickets), we keep the Supabase query if there's no backend endpoint yet
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .select('*, bookings!inner(showtime_id)')
      .eq('bookings.showtime_id', SHOWTIME_ID)

    if (ticketError) throw ticketError
    bookedSeatIds.value = new Set(ticketData.map(t => t.seat_id))

  } catch (err) {
    console.error('Error fetching seating data:', err)
  } finally {
    loading.value = false
  }
}

// Subscribe to Real-Time selections
let selectionSubscription: RealtimeChannel | null = null

const setupRealtime = () => {
  selectionSubscription = supabase
    .channel('public:seat_selections')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'seat_selections' }, (payload) => {
      const { user_id, showtime_id, seat_id } = (payload as unknown as RealtimeSelectionPayload).new
      
      if (showtime_id !== SHOWTIME_ID) return

      const myId = authStore.user?.userId

      if (myId && user_id === myId) {
        mySelections.value.add(seat_id)
      } else if (friendId && user_id === friendId) {
        friendSelections.value.add(seat_id)
      } else {
        otherSelections.value.add(seat_id)
      }
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'seat_selections' }, async () => {
       const currentSelections = await get<SeatSelection[]>(`/api/seats/selections/${SHOWTIME_ID}`)
       
       const myId = authStore.user?.userId
       const newMy = new Set<number>()
       const newFriend = new Set<number>()
       const newOther = new Set<number>()

       currentSelections.forEach(selection => {
         if (myId && selection.userId === myId) {
           newMy.add(selection.seatId)
         } else if (friendId && selection.userId === friendId) {
           newFriend.add(selection.seatId)
         } else {
           newOther.add(selection.seatId)
         }
       })
       
       mySelections.value = newMy
       friendSelections.value = newFriend
       otherSelections.value = newOther
    })
    .subscribe()
}

onMounted(() => {
  fetchInitialData()
  setupRealtime()
})

onUnmounted(() => {
  if (selectionSubscription) supabase.removeChannel(selectionSubscription)
})
</script>
<template>
  <div class="booking-page min-h-screen">
    <!-- Section 2: Progress Section (Stepper) -->
    <section class="progress-section w-full bg-gray-0 flex items-center justify-center border-b border-white/5">
      <StepperBar :steps="currentSteps" />
    </section>

    <!-- Section 3: Main Core (Seat Booking) -->
    <main class="booking-core max-w-[1440px] mx-auto px-4 lg:px-[120px] py-10 lg:py-[80px] flex flex-col lg:flex-row gap-10 lg:gap-[102px] overflow-x-hidden">

      <!-- Left: Seat Selector -->
      <div class="flex-1 overflow-x-hidden md:flex md:flex-col md:items-center lg:items-stretch">

        <!-- Loading State -->
        <div v-if="loading" class="w-full h-[400px] flex flex-col items-center justify-center gap-4 text-gray-400">
           <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-100"></div>
           <span class="style-body-2">Loading theater layout...</span>
        </div>

        <!-- Screen & Grid Wrapper (Responsive) -->
        <div v-else class="w-full max-w-[343px] md:max-w-none mx-auto flex flex-col gap-[28px] md:gap-16 mb-12 md:mb-20">

          <!-- The Screen -->
          <div class="w-full">
            <div class="screen-element relative h-[22px] md:h-12 rounded-t-[40px] bg-linear-to-r from-[#2C344E] to-[#516199] flex items-center justify-center">
               <span class="style-body-1 text-gray-400/50! uppercase tracking-widest text-[10px] md:text-base font-bold leading-6">screen</span>
            </div>
          </div>

          <!-- The Auditorium Grid -->
          <div class="flex flex-col justify-between h-auto gap-4 md:space-y-4 w-full md:items-center">
            <div v-for="rowChar in rowLabels" :key="rowChar" class="flex items-center justify-between md:justify-center md:gap-6 w-full h-auto">
              <!-- Left Row Label -->
              <span class="style-body-2-bold text-white/50! w-3 md:w-4 text-[10px] md:text-base text-left shrink-0">{{ rowChar }}</span>

              <div class="flex items-center justify-center flex-1 md:flex-none px-1.5 md:px-0 gap-2 md:gap-3 flex-wrap max-w-[343px] md:max-w-none">
                <!-- Dynamic Seats Grid -->
                <div v-for="(seat, index) in getSeatsByRow(rowChar)" :key="seat.id"
                     class="w-[18.66px] h-[18.66px] md:w-10 md:h-10 shrink-0"
                     :class="{ 'mr-4 md:mr-16': index === Math.floor(getSeatsByRow(rowChar).length / 2) - 1 }"
                >
                  <SeatIcon
                    :status="getSeatStatus(seat)"
                    @click="toggleSeat(seat)"
                    :class="getSeatStatus(seat) === 'available' || getSeatStatus(seat) === 'selected' ? 'cursor-pointer hover:scale-[1.15] transition-transform' : 'cursor-not-allowed opacity-80'"
                  />
                </div>
              </div>

              <!-- Right Row Label -->
              <span class="style-body-2-bold text-white/50! w-3 md:w-4 text-[10px] md:text-base text-right shrink-0">{{ rowChar }}</span>
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

             <div v-if="friendId" class="flex items-center gap-3">
               <div class="w-8 h-8 md:w-10 md:h-10 shrink-0">
                 <SeatIcon status="friend" />
               </div>
               <span class="style-body-2 text-green-400 font-bold">Friend's Seat</span>
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
