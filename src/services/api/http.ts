import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      throw new Error('Unauthorized — please log in again.')
    }
    const message = err.response?.data?.message ?? `HTTP ${err.response?.status}`
    throw new Error(message)
  },
)

export const get = <T>(path: string) => api.get<T>(path).then((r) => r.data)
export const post = <T>(path: string, body: unknown) => api.post<T>(path, body).then((r) => r.data)
export const put = <T>(path: string, body: unknown) => api.put<T>(path, body).then((r) => r.data)
export const del = <T>(path: string) => api.delete<T>(path).then((r) => r.data)
