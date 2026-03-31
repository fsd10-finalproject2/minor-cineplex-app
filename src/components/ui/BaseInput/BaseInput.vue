<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BaseInputProps, BaseInputEmits } from './BaseInput.types'
import SearchIcon from '@/assets/icons/SearchIcon.vue'
import XIcon from '@/assets/icons/XIcon.vue'

const props = withDefaults(defineProps<BaseInputProps>(), {
  state: 'default',
  showRightIcon: true,
  showLeftIcon: true,
  label: '',
  placeholder: '',
  helpText: '',
})

const emit = defineEmits<BaseInputEmits>()

const isFocused = ref(false)
const isDisabled = computed(() => props.state === 'disable')
const isError = computed(() => props.state === 'error')
const isFilled = computed(() => !!props.modelValue && props.modelValue.length > 0)
//บางสีลองใช้แล้วมันแปลก ๆ จาก figma เลยหาสีที่ใกล้เคียงกับ figma
const wrapperClasses = computed(() => {
  // 1. Base Style
  const layout = 'relative flex items-center h-10 rounded-sm border transition-all duration-150'

  // 2. Visual styles per state
  const styles = {
    error: 'bg-gray-100 border-[#e05252] shadow-[0_0_0_3px_rgba(224,82,82,0.10)]',
    disabled: 'bg-gray-100/50 border-transparent cursor-not-allowed',
    focused: 'bg-gray-100 border-gray-300 shadow-[0_0_0_3px_rgba(108,111,255,0.12)]',
    filled: 'bg-gray-100 border-[#3d4566]',
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
  const base = 'text-[16px] font-normal style-body-2 tracking-wide select-none'
  const styles = {
    disabled: 'text-[#3a4060]',
    default: 'text-gray-400',
  }
  return [base, isDisabled.value ? styles.disabled : styles.default]
})

const inputClasses = computed(() => {
  const base = 'flex-1 h-full bg-transparent border-none outline-none text-[16px] py-[12px]'
  const styles = {
    disabled: 'text-[#3a4060] cursor-not-allowed placeholder:text-[#3a4060]',
    default: 'text-white placeholder:text-gray-300',
  }
  return [
    base,
    isDisabled.value ? styles.disabled : styles.default,
    props.showLeftIcon ? 'pl-[40px]' : 'pl-[16px]',
    props.showRightIcon ? 'pr-[40px]' : 'pr-[12px]',
  ]
})

const helpTextClasses = computed(() => {
  const base = 'text-xs leading-snug m-0'
  const styles = {
    error: 'text-[#e05252]',
    disabled: 'text-[#3a4060]',
    default: 'text-[#6b7399]',
  } //ใช้สีใกล้เคียงกับ figma
  const textStyle = isError.value
    ? styles.error
    : isDisabled.value
      ? styles.disabled
      : styles.default
  return [base, textStyle]
})

const leftIconClasses = computed(() => {
  const base = 'absolute left-2.5 flex items-center justify-center pointer-events-none'
  const styles = {
    disabled: 'text-[#3a4060]',
    default: 'text-[#4e567a]',
  }
  return [base, isDisabled.value ? styles.disabled : styles.default]
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
        type="text"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <!--Right Icon show when has value and not disabled-->
      <button
        v-if="showRightIcon && modelValue && !isDisabled"
        type="button"
        aria-label="Clear input"
        class="absolute right-2.5 flex items-center justify-center text-[#4e567a] rounded p-0.5 cursor-pointer transition-colors duration-150 hover:text-[#c8ccde] hover:bg-white/[0.06]"
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
