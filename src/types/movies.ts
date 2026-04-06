export interface bookingCard {
  posterUrl: string
  title: string
  tags: string[]
  language: string
  cinema: string
  date: string
  time: string
  theater: string
  selectedSeats?: string[]
  total?: number
  showCoupon?: boolean
  showPaymentMethod?: boolean
  showTimer?: boolean
  paymentMethod?: string
  couponName?: string
  couponDiscount?: number
}
