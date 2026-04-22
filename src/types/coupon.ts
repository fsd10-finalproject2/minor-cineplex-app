export interface CouponResponse {
  id: number
  code: string
  name: string // from coupon_info.coupon_name
  description: string | null
  discountType: 'percentage' | 'fixed'
  discountValue: number
  maxDiscount: number | null
  minPrice: number | null
  startDate: string | null
  expiresAt: string | null
  couponsImgUrl: string | null
  isActive: boolean
  couponType: string | null
  usageLimit: number | null
  usagePerUser: number | null
  usageCount: number | null
  formattedDiscount: string
}

// Alias for backwards compatibility
export type CouponSelected = CouponResponse

export interface CalculateDiscountRequest {
  couponId: number
  orderTotal: number
}

export interface CalculateDiscountResponse {
  valid: boolean
  discount: number
  finalTotal: number
  error?: string
}
