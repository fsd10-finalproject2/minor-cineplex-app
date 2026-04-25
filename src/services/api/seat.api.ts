import type {
  TheaterSeatsResponse,
  SelectionResponse,
  SeatSelectionRequest,
  SeatSelection,
} from '@/types/seat'

const API_BASE = 'http://localhost:8080/api'

export const seatApi = {
  /**
   * Get all seats for a theater
   */
  async getTheaterSeats(theaterId: number): Promise<TheaterSeatsResponse | null> {
    try {
      const response = await fetch(`${API_BASE}/seats/theater/${theaterId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (!response.ok) {
        return null
      }

      return response.json()
    } catch {
      return null
    }
  },

  /**
   * Get current seat selections for a showtime
   */
  async getSelections(showtimeId: number): Promise<SelectionResponse | null> {
    try {
      const response = await fetch(`${API_BASE}/selections/${showtimeId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (!response.ok) {
        return null
      }

      return response.json()
    } catch {
      return null
    }
  },

  /**
   * Select a seat for a showtime
   */
  async selectSeat(request: SeatSelectionRequest): Promise<SeatSelection | null> {
    try {
      const response = await fetch(`${API_BASE}/seats/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        return null
      }

      return response.json()
    } catch {
      return null
    }
  },

  /**
   * Deselect a seat for a showtime
   */
  async deselectSeat(request: SeatSelectionRequest): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/seats/deselect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(request),
      })

      return response.ok
    } catch {
      return false
    }
  },
}
