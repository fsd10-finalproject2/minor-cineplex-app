export interface CouponCardItem {
  id: number
  title: string
  description: string
  SalesPeriod: string //Period of time the coupon is available for sale
  RedemptionPeriod: string //Period of time the coupon is available for redemption
  expiredAt: string //Date the coupon expires
  termsAndConditions: string[] //Terms and conditions of the coupon
  image: string
  hasCoupon: boolean
}

export interface CouponTab {
  id: number
  filter: 'all' | 'uob' | 'coke' | 'kbank' | 'gsb' | 'ais' | 'other'
  name: string
}
