export interface Seat {
  id: number
  row: string
  number: number
  type: 'STANDARD' | 'PREMIUM' | 'VIP'
  price: number
  status: 'AVAILABLE' | 'OCCUPIED' | 'SELECTED' | 'RESERVED'
}

export interface SeatSelection {
  id: number
  seatId: number
  showtimeId: number
  sessionId: string
  expiresAt: string
}

export interface SeatSelectionRequest {
  seatId: number
  showtimeId: number
}

export interface TheaterSeatsResponse {
  theaterId: number
  theaterName: string
  rows: number
  columns: number
  seats: Seat[]
}

export interface SelectionResponse {
  selections: SeatSelection[]
  expiresAt: string
}
