import type { InputState } from './baseInput'

export interface BaseTextareaProps {
  modelValue: string
  label?: string
  placeholder?: string
  helpText?: string
  state?: InputState
  rows?: number
  minRows?: number
  maxRows?: number
}

export interface BaseTextareaEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'focus'): void
  (e: 'blur'): void
}
