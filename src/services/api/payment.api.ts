const API_BASE = 'http://localhost:8080/api/payments'

export interface PaymentIntentResponse {
  clientSecret: string
  bookingId: number
  amount: number
  discountAmount: number
  finalAmount: number
  currency: string
}

export interface CreatePaymentIntentRequest {
  showtimeId: number
  seatIds: number[]
  couponId?: number | null
}

export interface ConfirmPaymentRequest {
  bookingId: number
  paymentIntentId: string
}

export interface ConfirmPaymentResponse {
  success: boolean
  message: string
  bookingId: number
}

export const paymentApi = {
  /**
   * Create a payment intent and pending booking
   */
  async createPaymentIntent(request: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> {
    const response = await fetch(`${API_BASE}/create-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Payment failed' }))
      throw new Error(error.message || `Payment failed: ${response.status}`)
    }

    return response.json()
  },

  /**
   * Confirm a successful payment
   */
  async confirmPayment(request: ConfirmPaymentRequest): Promise<ConfirmPaymentResponse> {
    const response = await fetch(`${API_BASE}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Confirmation failed' }))
      throw new Error(error.message || `Confirmation failed: ${response.status}`)
    }

    return response.json()
  },
}
