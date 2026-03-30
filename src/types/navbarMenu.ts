export type Page = 'booking-history' | 'my-coupons' | 'profile' | 'reset-password'

export type Variant = 'default' | 'logout'

export interface User {
  name: string
  avatar?: string
}
