import { get } from './http'

export interface MovieSearchParams {
  name?: string
  language?: string
  genre?: string
  city?: string
  releaseDate?: string
  wheelchairAccess?: boolean
  hearingAssistance?: boolean
}

export interface Movie {
  id: number
  title: string
  description: string
  durationMinutes: number
  posterUrl: string
  trailerUrl: string
  rating: string
  genres: string[]
  language: string
  releaseDate: string
}

export const movieApi = {
  getMovies: () => get<Movie[]>('/api/movies'),
  getMovieById: (id: number) => get<Movie>(`/api/movies/${id}`),
  searchMovies: (query: string) => get<Movie[]>(`/api/movies/search?query=${query}`),
  filterMovies: (params: MovieSearchParams) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value)
    })
    return get<Movie[]>(`/api/movies/filter?${searchParams.toString()}`)
  },
}
