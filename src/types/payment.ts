export interface Movie {
  title: string
  tags: string[]
  posterEmoji?: string
}

export interface BookingDetail {
  cinema: string
  date: string
  time: string
  theater: string
}

export interface Coupon {
  code: string
  label: string
  discount: number
}

export interface OrderSummaryProps {
  movie: Movie
  booking: BookingDetail
  seats: string[]
  paymentMethod: string
  coupon?: Coupon | null
  totalPrice: number
  countdownSeconds?: number
}

export interface PaymentIntentData {
  clientSecret: string
  bookingId: number
  amount: number
  discountAmount: number
  finalAmount: number
  currency: string
}

export interface BookingResult {
  bookingId: number
  movieTitle: string
  cinemaName: string
  hallName: string
  startTime: string
  seatNumbers: string[]
  totalPrice: number
  status: string
}
