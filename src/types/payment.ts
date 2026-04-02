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
