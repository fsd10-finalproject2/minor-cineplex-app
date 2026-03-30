import { NoteBookIcon, TicketIcon, UserIcon, RefreshIcon } from '@/assets/icons'
import type { Page } from '@/types/navbarMenu'
import type { Component } from 'vue'

interface MenuItem {
  id: Page
  label: string
  icon: Component
  to: string
}

export const menuItems: MenuItem[] = [
  {
    id: 'booking-history',
    label: 'Booking history',
    icon: NoteBookIcon,
    to: '/account/booking-history',
  },
  { id: 'my-coupons', label: 'My coupons', icon: TicketIcon, to: '/account/my-coupons' },
  { id: 'profile', label: 'Profile', icon: UserIcon, to: '/account/profile' },
  {
    id: 'reset-password',
    label: 'Reset password',
    icon: RefreshIcon,
    to: '/account/reset-password',
  },
]
