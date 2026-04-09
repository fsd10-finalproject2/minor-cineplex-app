import { ref } from 'vue'

export type ErrorSeverity = 'error' | 'warning' | 'info'

export interface AppError {
  id: string
  message: string
  severity: ErrorSeverity
  field?: string
  code?: string | number
}

type ApiError = {
  response?: {
    status?: number
    data?: {
      message?: string
      error?: string
      errors?: Record<string, string[] | string>
    }
  }
  message?: string
}

export function useErrorHandler() {
  const errors = ref<AppError[]>([])

  function parseError(err: unknown): AppError {
    const id = crypto.randomUUID()

    if (err && typeof err === 'object') {
      const e = err as ApiError

      if (e.response) {
        const status = e.response.status ?? 0
        const data = e.response.data

        const message = data?.message || data?.error || statusMessage(status)

        return {
          id,
          message,
          severity: 'error',
          code: status,
        }
      }


      if (err instanceof Error) {
        return {
          id,
          message: err.message,
          severity: 'error',
        }
      }

      if (typeof e.message === 'string') {
        return {
          id,
          message: e.message,
          severity: 'error',
        }
      }
    }

    return {
      id,
      message: 'Something went wrong. Please try again.',
      severity: 'error',
    }
  }

  function push(err: unknown) {
    const parsed = parseError(err)
    errors.value.push(parsed)
    return parsed
  }

  function dismiss(id: string) {
    errors.value = errors.value.filter((e) => e.id !== id)
  }

  function clear() {
    errors.value = []
  }

  return { errors, push, dismiss, clear }
}

function statusMessage(status: number): string {
  const map: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Session expired. Please log in again.',
    403: "You don't have permission to do that.",
    404: 'The requested resource was not found.',
    409: 'A conflict occurred. Please refresh and try again.',
    422: 'Validation failed. Please check your input.',
    429: 'Too many requests. Please slow down.',
    500: 'Server error. Please try again later.',
    503: 'Service unavailable. Please try again later.',
  }

  return map[status] ?? `Unexpected error (${status}).`
}

export type ErrorHandlerReturn = ReturnType<typeof useErrorHandler>

export const ErrorHandlerKey: { _type?: ErrorHandlerReturn } & symbol = Symbol('errorHandler')
