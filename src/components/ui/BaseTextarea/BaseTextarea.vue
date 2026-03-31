<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import type { BaseTextareaProps, BaseTextareaEmits } from '@/types/baseTextarea'
import ResizeIcon from '@/assets/icons/ResizeIcon.vue'

const props = withDefaults(defineProps<BaseTextareaProps>(), {
  state: 'default',
  label: '',
  placeholder: '',
  helpText: '',
  rows: 4,
  minRows: 2,
  maxRows: 8,
})

const emit = defineEmits<BaseTextareaEmits>()
const isFocused = ref(false)
const isDisabled = computed(() => props.state === 'disabled')
const isFilled = computed(() => !!props.modelValue && props.modelValue.length > 0)

// Resize functionality
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isResizing = ref(false)
const currentHeight = ref<number | null>(null)
const startY = ref(0)
const startHeight = ref(0)

const wrapperClasses = computed(() => {
  // 1. Base styles
  const base = 'relative border transition-all duration-150 rounded-sm'

  // 2. Visual styles per state
  const styles = {
    disabled: 'border-transparent cursor-not-allowed', //เพิ่มเติมจาก figma
    focused: 'border-gray-300 shadow-[0_0_0_3px_rgba(108,111,255,0.12)] text-gray-300',
    filled: 'border-gray-200',
    default: 'border-gray-200',
  }

  // 3. Pick one style based on state priority
  const visualStyle = isDisabled.value
    ? styles.disabled
    : isFocused.value
      ? styles.focused
      : isFilled.value
        ? styles.filled
        : styles.default

  return [base, visualStyle]
})

const labelClasses = computed(() => {
  const base = 'text-[16px] font-normal tracking-wide select-none style-body-2'
  const styles = {
    disabled: 'text-[#3a4060]',
    default: 'text-gray-400',
  }
  return [base, isDisabled.value ? styles.disabled : styles.default]
})

const textareaClasses = computed(() => {
  const base =
    'w-full bg-gray-100 border-none outline-none resize-none text-[16px] pt-[8px] pl-[8px] pb-[2px] pr-[2px] style-body-2'
  const styles = {
    disabled: 'text-[#3a4060] cursor-not-allowed placeholder:text-[#3a4060]',
    default: 'text-white placeholder:text-gray-300',
  }
  return [base, isDisabled.value ? styles.disabled : styles.default]
})

const resizeHandleClasses = computed(() => {
  const base = 'absolute bottom-1 right-1 cursor-ns-resize select-none'
  const styles = {
    disabled: 'text-[#3a4060] pointer-events-none',
    resizing: 'text-[#6c6fff]',
    default: 'text-gray-200',
  }
  const visualStyle = isDisabled.value
    ? styles.disabled
    : isResizing.value
      ? styles.resizing
      : styles.default
  return [base, visualStyle]
})

// Textarea inline style for min/max height
const lineHeight = 24 // ความสูงของแต่ละ row ใน textarea
const paddingY = 10 // pt-[8px] + pb-[2px]
const minHeight = computed(() => props.minRows * lineHeight + paddingY)
const maxHeight = computed(() => props.maxRows * lineHeight + paddingY)

const textareaStyle = computed(() => ({
  minHeight: `${minHeight.value}px`,
  maxHeight: `${maxHeight.value}px`,
  ...(currentHeight.value !== null && { height: `${currentHeight.value}px` }),
}))

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

// Resize handlers
function startResize(event: MouseEvent | TouchEvent) {
  if (isDisabled.value) return

  isResizing.value = true
  const clientY = 'touches' in event ? (event.touches[0]?.clientY ?? 0) : event.clientY
  startY.value = clientY

  // Get current height from textarea
  if (textareaRef.value) {
    startHeight.value = textareaRef.value.offsetHeight
  }

  // Add global listeners
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', onResize)
  document.addEventListener('touchend', stopResize)

  // Prevent text selection while resizing
  event.preventDefault()
}

function onResize(event: MouseEvent | TouchEvent) {
  if (!isResizing.value) return

  const clientY = 'touches' in event ? (event.touches[0]?.clientY ?? 0) : event.clientY
  const deltaY = clientY - startY.value
  const newHeight = startHeight.value + deltaY

  // Clamp height within min/max bounds
  currentHeight.value = Math.min(Math.max(newHeight, minHeight.value), maxHeight.value)
}

function stopResize() {
  isResizing.value = false

  // Remove global listeners
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', onResize)
  document.removeEventListener('touchend', stopResize)
}

// Cleanup on unmount
onUnmounted(() => {
  stopResize()
})

//^^^^^ Resize Handler ^^^^^
</script>
<template>
  <div class="flex flex-col gap-[4px]">
    <!--Label-->
    <label v-if="label" :class="labelClasses">{{ label }}</label>
    <!--Textarea Wrapper-->
    <div :class="wrapperClasses">
      <textarea
        ref="textareaRef"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="isDisabled"
        :rows="rows"
        :class="textareaClasses"
        :style="textareaStyle"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <!--Custom Resize Handle-->
      <span
        :class="resizeHandleClasses"
        aria-label="Resize textarea"
        role="slider"
        @mousedown="startResize"
        @touchstart="startResize"
      >
        <ResizeIcon :size="30" />
      </span>
    </div>
  </div>
</template>
