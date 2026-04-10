/** ตาม `CouponPageResponse` / `CouponResponse` ใน docs/api-coupons-promotions.md */

export interface CouponPageResponse {
  data?: CouponResponseItem[]
  currentPage?: number
  totalPage?: number
}

export interface CouponResponseItem {
  id: number
  code?: string | null
  couponName?: string | null
  couponDescription?: string | null
  couponTermsConditions?: string | null
  startDate?: string | null
  expiresAt?: string | null
  couponsImgUrl?: string | null
  partnerName?: string | null
  isActive?: boolean | null
  redemptionStartAt?: string | null
  redemptionExpiresAt?: string | null
  hasCoupon?: boolean | null
}
