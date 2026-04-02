<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BaseInputProps, BaseInputEmits } from '../../../types/baseInput'
import SearchIcon from '@/assets/icons/SearchIcon.vue'
import XIcon from '@/assets/icons/XIcon.vue'

const props = withDefaults(defineProps<BaseInputProps>(), {
  state: 'default',
  showRightIcon: true,
  showLeftIcon: true,
  label: '',
  placeholder: '',
  helpText: '',
  type: 'text',
})

const emit = defineEmits<BaseInputEmits>()

const isFocused = ref(false)
const isDisabled = computed(() => props.state === 'disable')
const isError = computed(() => props.state === 'error')
const isFilled = computed(() => !!props.modelValue && props.modelValue.length > 0)
const wrapperClasses = computed(() => {
  // 1. Base Style
  const layout =
    'flex items-center rounded-sm border transition-all duration-150 pl-[16px] py-[12px] pr-[12px] gap-[4px]'

  // 2. Visual styles per state
  const styles = {
    error: 'bg-gray-100 border-[#F34335] shadow-[0_0_0_3px_rgba(224,82,82,0.10)]',
    disabled: 'bg-gray-100/50 border-transparent cursor-not-allowed',
    focused: 'bg-gray-100 border-gray-300 shadow-[0_0_0_3px_rgba(108,111,255,0.12)]',
    filled: 'bg-gray-100 border-gray-200',
    default: 'bg-gray-100 border-gray-200',
  }

  // 3. Pick one style based on state priority
  const visualStyle = isError.value
    ? styles.error
    : isDisabled.value
      ? styles.disabled
      : isFocused.value
        ? styles.focused
        : isFilled.value
          ? styles.filled
          : styles.default

  return [layout, visualStyle]
})

const labelClasses = computed(() => {
  const base = 'text-[16px] style-body-2 tracking-wide select-none'
  const styles = {
    error: 'text-gray-400',
    disabled: 'text-gray-400/50',
    default: 'text-gray-400',
  }
  return [base, isDisabled.value ? styles.disabled : isError.value ? styles.error : styles.default]
})

const inputClasses = computed(() => {
  const base = 'flex-1 h-full bg-transparent border-none outline-none text-[16px]'
  const styles = {
    error: 'text-white',
    disabled: 'text-gray-300/50 cursor-not-allowed',
    default: 'text-white placeholder:text-gray-300',
  }
  return [base, isDisabled.value ? styles.disabled : isError.value ? styles.error : styles.default]
})

const helpTextClasses = computed(() => {
  const base = 'text-xs leading-snug m-0'
  const styles = {
    error: 'text-[#F34335]',
    disabled: 'text-gray-300/50',
    default: 'text-gray-300',
  }
  const textStyle = isError.value
    ? styles.error
    : isDisabled.value
      ? styles.disabled
      : styles.default
  return [base, textStyle]
})

const leftIconClasses = computed(() => {
  const base = 'flex items-center justify-center pointer-events-none'
  const styles = {
    disabled: 'text-white/50',
    error: 'text-white',
    default: 'text-gray-400',
  }
  return [base, isDisabled.value ? styles.disabled : isError.value ? styles.error : styles.default]
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="flex flex-col gap-[4px]">
    <!--Label-->
    <label v-if="label" :class="labelClasses">
      {{ label }}
    </label>
    <!--Input Wrapper-->
    <div :class="wrapperClasses">
      <!--Search Icon (left)-->
      <span v-if="showLeftIcon" :class="leftIconClasses" aria-hidden="true">
        <SearchIcon />
      </span>
      <!--Input Element-->
      <input
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="isDisabled"
        :class="inputClasses"
        :type="type"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <!--Right Icon show when has value and not disabled-->
      <button
        v-if="showRightIcon && modelValue && !isDisabled"
        type="button"
        aria-label="Clear input"
        class="flex items-center justify-center text-gray-300"
        @click="onClear"
      >
        <XIcon />
      </button>
    </div>

    <!--Help Text-->
    <p v-if="helpText" :class="helpTextClasses">
      {{ helpText }}
    </p>
  </div>
</template>
