import type { CouponResponse, CalculateDiscountResponse } from '@/types/coupon'

const API_BASE = 'http://localhost:8080/api/coupons'

export const couponApi = {
  /**
   * Get available coupons (active, not expired, has usage left)
   */
  async getAvailableCoupons(): Promise<CouponResponse[]> {
    try {
      const response = await fetch(API_BASE, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (!response.ok) {
        return []
      }

      return response.json()
    } catch {
      return []
    }
  },

  /**
   * Calculate discount for a coupon
   */
  async calculateDiscount(couponId: number, orderTotal: number): Promise<CalculateDiscountResponse> {
    try {
      const response = await fetch(`${API_BASE}/calculate-discount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ couponId, orderTotal }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to calculate discount' }))
        return {
          valid: false,
          discount: 0,
          finalTotal: orderTotal,
          error: error.error || 'Invalid coupon',
        }
      }

      const data = await response.json()
      return {
        valid: data.valid ?? true,
        discount: data.discount ?? 0,
        finalTotal: data.finalTotal ?? orderTotal,
        error: data.error,
      }
    } catch {
      return {
        valid: false,
        discount: 0,
        finalTotal: orderTotal,
        error: 'Failed to validate coupon',
      }
    }
  },
}
