import { ref, computed } from 'vue'

type FieldErrors = Record<string, string>

type ApiError = {
  response?: {
    data?: {
      message?: string
      error?: string
      errors?: Record<string, string[] | string>
    }
  }
  message?: string
}

export function useFormErrors() {
  const fieldErrors = ref<FieldErrors>({})
  const globalError = ref<string | null>(null)

  function setFromResponse(err: unknown) {
    fieldErrors.value = {}
    globalError.value = null

    if (err && typeof err === 'object') {
      const e = err as ApiError
      const data = e.response?.data

      if (data?.errors && typeof data.errors === 'object') {
        for (const [field, messages] of Object.entries(data.errors)) {
          const message = Array.isArray(messages)
            ? (messages[0] ?? 'Invalid value')
            : String(messages)

          fieldErrors.value[field] = message
        }
        return
      }

      const message = data?.message || data?.error || e.message || 'Something went wrong'

      const parts = message.split(',')

      let mapped = false

      for (const part of parts) {
        const [fieldRaw, msgRaw] = part.split(':')
        const field = fieldRaw?.trim()
        const msg = msgRaw?.trim()

        if (field && msg) {
          fieldErrors.value[field] = msg
          mapped = true
        }
      }

      if (!mapped) {
        globalError.value = message
      }
    }
  }

  function fieldError(field: string): string | null {
    return fieldErrors.value[field] ?? null
  }

  function clear() {
    fieldErrors.value = {}
    globalError.value = null
  }

  const hasErrors = computed(() => {
    return !!globalError.value || Object.keys(fieldErrors.value).length > 0
  })

  return {
    fieldErrors,
    globalError,
    hasErrors,
    setFromResponse,
    fieldError,
    clear,
  }
}
