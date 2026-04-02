export interface BaseInputProps {
  modelValue: string
  label?: string
  placeholder?: string
  helpText?: string
  state?: 'default' | 'error' | 'disable' //สถานะของ input
  showRightIcon?: boolean //ไอคอนด้านขวาของช่อง Input
  showLeftIcon?: boolean //ไอคอนด้านซ้ายของช่อง Input
  type?: string // Input type (e.g. 'text', 'password')
}

export interface BaseInputEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'clear'): void
  (e: 'focus'): void
  (e: 'blur'): void
}

export type InputState = 'default' | 'error' | 'disabled'
