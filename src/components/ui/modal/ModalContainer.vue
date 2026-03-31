<script lang="ts">
export default {
  name: 'UIModalContainer',
}
</script>

<script setup lang="ts">
import { computed, onUnmounted, useId, useSlots, watch, type Component } from 'vue'
import CustomButton from '../CustomButton.vue'
import XIcon from '@/assets/icons/XIcon.vue'



export type ModalButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ModalButtonSize = 'sm' | 'md' | 'lg'

export type ModalActionContainer = {
  id?: string
  label: string
  variant?: ModalButtonVariant
  styleButton?: string
  closeOnClick?: boolean
  disabled?: boolean
  handler?: () => void
}

export type ModalActionHeader = {
  id?: string
  icon?: Component
  closeOnClick?: boolean
  handler?: () => void
}


const props = withDefaults(
  defineProps<{
    modelValue: boolean
    styleModalContainer?: string
    title?: string
    styleTitle?: string
    closeOnBackdrop?: boolean
    closeOnEsc?: boolean
    persistent?: boolean
    showCloseButton?: boolean
    headerActions?: ModalActionHeader[]
    actions?: ModalActionContainer[]
  }>(),
  {
    closeOnBackdrop: true,
    closeOnEsc: true,
    persistent: false,
    showCloseButton: true,
    actions: () => [],
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
  actionClick: [action: ModalActionContainer, index: number]
  actionHeaderClick: [action: ModalActionHeader, index: number]
}>()

const slots = useSlots()
const titleId = useId()

const hasHeaderSlot = computed(() => Boolean(slots.header))
const hasFooterSlot = computed(() => Boolean(slots.footer))
const hasActionButtons = computed(() => props.actions.length > 0)

const effectiveCloseOnBackdrop = computed(() =>
  props.persistent ? false : props.closeOnBackdrop,
)
const effectiveCloseOnEsc = computed(() => (props.persistent ? false : props.closeOnEsc))


const actionContainerClass = computed(() => {
  if (props.actions.length <= 1) return 'flex justify-center'
  return 'flex flex-row justify-between'
})

function onActionHeaderClick(action: ModalActionHeader, index: number) {
  if (action.handler) {
    action.handler();
  }
  emit('actionHeaderClick', action, index)
  if (action.closeOnClick ?? true) {
    close()
  }
}

function onActionClick(action: ModalActionContainer, index: number) {
  if (action.handler) {
    action.handler();
  }
  emit('actionClick', action, index)
  if (action.closeOnClick ?? true) {
    close()
  }
}

function close() {
  if (!props.modelValue) return
  emit('update:modelValue', false)
  emit('close')
}

function onBackdropClick() {
  if (effectiveCloseOnBackdrop.value) close()
}

function onDocumentKeydown(e: KeyboardEvent) {
  if (
    e.key !== 'Escape' ||
    e.defaultPrevented ||
    !props.modelValue ||
    !effectiveCloseOnEsc.value
  ) {
    return
  }
  e.preventDefault()
  close()
}

watch(
  () => props.modelValue,
  (open: boolean) => {
    if (typeof document === 'undefined') return
    if (open) {
      document.body.style.overflow = 'hidden'
      emit('open')
      document.addEventListener('keydown', onDocumentKeydown)
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onDocumentKeydown)
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  document.removeEventListener('keydown', onDocumentKeydown)
  document.body.style.overflow = ''
})

defineExpose({ close })
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden shadow-[4px_4px_30px_0px_rgba(0,0,0,0.5)]">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" @click="onBackdropClick" />

      <section role="dialog" aria-modal="true" :aria-labelledby="title ? titleId : undefined" class="relative z-50 flex flex-col gap-4 p-6 overflow-hidden rounded-2xl border
                border-gray-200 bg-gray-800 text-white shadow-2xl" :class="props.styleModalContainer ?? 'w-fit'">
        <header v-if="hasHeaderSlot || title || showCloseButton"
          class="relative flex shrink-0 items-center justify-center">
          <slot name="header">
            <h2 v-if="title" :id="titleId" class="style-headline-4 text-center text-gray-100 dark:text-white"
              :class="props.styleTitle ?? ''">
              {{ title }}
            </h2>
            <span v-else class="min-w-0 flex-1 gap-4" />
            <div class="absolute right-0 p-1.5 flex flex-row items-center justify-center ">

              <button v-for="(action, index) in headerActions" :key="action.id ?? index"
                type="button"
                class="p-1.5 rounded-full text-gray-100 dark:text-gray-400 transition-colors hover:bg-gray-300/20 hover:dark:bg-white/10 hover:dark:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-100">
                <span aria-hidden="true" class="flex items-center justify-center">
                  <slot name="headerAction" :action="action" :index="index">
                    <component :is="action.icon" v-if="action.icon" class="w-6 h-6" @click="onActionHeaderClick(action, index)" />
                  </slot>
                </span>
              </button>

              <button v-if="showCloseButton" type="button"
                class="p-1.5 rounded-full text-gray-100 dark:text-gray-400 transition-colors hover:bg-gray-300/20 hover:dark:bg-white/10 hover:dark:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-100"
                aria-label="Close dialog" @click="close">
                <span aria-hidden="true">
                  <XIcon class="w-6 h-6" />
                </span>
              </button>
            </div>
          </slot>
        </header>

        <article class="style-body-2-regular min-h-0 flex-1 overflow-auto text-center text-gray-200 dark:text-gray-400">
          <slot />
        </article>

        <footer v-if="hasFooterSlot || hasActionButtons" class="shrink-0">
          <slot name="footer" :close="close">
            <div :class="actionContainerClass">
              <CustomButton v-for="(action, index) in actions" :key="action.id ?? `${action.label}-${index}`"
                :label="action.label" :variant="action.variant ?? 'primary'" :disabled="action.disabled"
                :class="action.styleButton ?? 'w-fit'" @click="onActionClick(action, index)" />
            </div>
          </slot>
        </footer>
      </section>
    </div>
  </Teleport>
</template>
