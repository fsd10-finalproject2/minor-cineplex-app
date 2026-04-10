/** UI model aligned with `CouponResponse` in docs/api-coupons-promotions.md */
export interface CouponCardItem {
  id: number
  title: string
  description: string
  /** ISO datetime from API (`startDate`) */
  startDate: string
  /** ISO datetime from API (`expiresAt`) — e.g. “Valid until” on the card */
  expiresAt: string
  redemptionStartAt: string
  redemptionExpiresAt: string
  termsAndConditions: string[] //Terms and conditions of the coupon
  image: string
  hasCoupon: boolean
}

export interface CouponTab {
  id: number
  filter: 'all' | 'uob' | 'coke' | 'kbank' | 'gsb' | 'ais' | 'other'
  name: string
}
