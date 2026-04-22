import { defineStore } from 'pinia'

interface ShowtimeInfo {
  posterUrl: string
  title: string
  tags: string[]
  language: string
  cinema: string
  date: string
  time: string
  theater: string
}

interface BookingResult {
  bookingId: number
  amount: number
  discountAmount: number
  finalAmount: number
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    showtime: null as ShowtimeInfo | null,
    selectedSeats: [] as string[],
    seatPrice: 150,
    // Payment-related state
    showtimeId: null as number | null,
    seatIds: [] as number[],
    couponId: null as number | null,
    bookingResult: null as BookingResult | null,
  }),

  getters: {
    totalPrice: (state) => state.selectedSeats.length * state.seatPrice,
    hasValidBooking: (state) => state.showtime !== null && state.selectedSeats.length > 0,
  },

  actions: {
    setShowtime(info: ShowtimeInfo) {
      this.showtime = info
      this.selectedSeats = []
    },
    setSelectedSeats(seats: string[]) {
      this.selectedSeats = seats
    },
    toggleSeat(seatId: string) {
      const index = this.selectedSeats.indexOf(seatId)
      if (index > -1) {
        this.selectedSeats.splice(index, 1)
      } else {
        this.selectedSeats.push(seatId)
      }
    },
    setShowtimeId(id: number) {
      this.showtimeId = id
    },
    setSeatIds(ids: number[]) {
      this.seatIds = ids
    },
    setCouponId(id: number | null) {
      this.couponId = id
    },
    setBookingResult(result: BookingResult) {
      this.bookingResult = result
    },
    clearBooking() {
      this.showtime = null
      this.selectedSeats = []
      this.showtimeId = null
      this.seatIds = []
      this.couponId = null
      this.bookingResult = null
    },
  },
})
