import { get } from './http'

export interface CinemaResponse {
  id: number
  name: string
  address: string
  city: string
  latitude: number
  longitude: number
  distance?: number
}

const buildQueryString = (latitude?: number, longitude?: number) => {
  const params = new URLSearchParams()
  if (latitude !== undefined) params.append('latitude', latitude.toString())
  if (longitude !== undefined) params.append('longitude', longitude.toString())
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const cinemaApi = {
  getAll: (latitude?: number, longitude?: number) =>
    get<CinemaResponse[]>(`/api/cinemas${buildQueryString(latitude, longitude)}`),

  getByCity: (city: string, latitude?: number, longitude?: number) =>
    get<CinemaResponse[]>(`/api/cinemas/city/${city}${buildQueryString(latitude, longitude)}`)
}
