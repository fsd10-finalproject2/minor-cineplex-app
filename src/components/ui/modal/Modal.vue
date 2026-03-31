<script lang="ts">
export default {
    name: 'UIModal',
}
</script>

<script setup lang="ts">
import { computed, onUnmounted, useId, useSlots, watch } from '@vue/runtime-core'
import CustomButton from '../CustomButton.vue'
import XIcon from '@/assets/icons/XIcon.vue'

/** ขนาดความกว้างของกล่องโมดอล (จำกัด max-width และเต็มความกว้างบนจอเล็ก) */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type ModalButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ModalButtonSize = 'sm' | 'md' | 'lg'

export type ModalAction = {
    id?: string
    label: string
    variant?: ModalButtonVariant
    size?: ModalButtonSize
    closeOnClick?: boolean
    disabled?: boolean
     handler?: () => void
}

const props = withDefaults(
    defineProps<{
        /** สถานะเปิด/ปิดแบบควบคุมจากภายนอก ใช้งานร่วมกับ `v-model` */
        modelValue: boolean
        /** หัวข้อโมดอลเมื่อไม่ได้ส่ง `#header` slot */
        title?: string
        /** เนื้อหาข้อความแบบสั้น หากไม่ใช้ default slot */
        content?: string
        size?: ModalSize
        /** คลิกฉากหลังเพื่อปิด เมื่อ `persistent` เป็น false */
        closeOnBackdrop?: boolean
        /** กดปุ่ม Escape เพื่อปิด เมื่อ `persistent` เป็น false */
        closeOnEsc?: boolean
        /**
         * เมื่อเป็น true จะปิดไม่ได้จากฉากหลังหรือปุ่ม Escape
         * ยังสามารถปิดจากปุ่มปิดที่ header หรือ action ใน footer ได้
         */
        persistent?: boolean
        /** แสดงปุ่มปิดใน header แบบค่าเริ่มต้น (กรณีไม่ได้ใช้ `#header` slot) */
        showCloseButton?: boolean
        /** รายการปุ่ม action ใต้โมดอล (จำนวนปุ่มขึ้นอยู่กับจำนวนข้อมูลในอาเรย์) */
        actions?: ModalAction[]
    }>(),
    {
        size: 'md',
        closeOnBackdrop: true,
        closeOnEsc: true,
        persistent: false,
        showCloseButton: true,
        actions: () => [],
    },
)

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    /** ส่ง event เมื่อโมดอลถูกเปิด */
    open: []
    /** ส่ง event เมื่อโมดอลถูกปิด ไม่ว่าจากผู้ใช้หรือโค้ด */
    close: []
    /** ส่ง event เมื่อกดปุ่ม action พร้อมข้อมูลปุ่มและตำแหน่ง */
    actionClick: [action: ModalAction, index: number]
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

const sizeClass = computed(() => {
    const map: Record<ModalSize, string> = {
        sm: 'max-w-sm',
        md: 'max-w-[343px]',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[min(100vw-2rem,120rem)]',
    }
    return map[props.size as ModalSize]
})

const actionContainerClass = computed(() => {
    if (props.actions.length <= 1) return 'flex justify-center'
    return 'grid grid-cols-2 gap-4'
})

const actionSizeClassMap: Record<ModalButtonSize, string> = {
    sm: 'h-9 min-w-[120px] px-5',
    md: 'h-10 min-w-[140px] px-6',
    lg: 'h-12 min-w-[160px] px-7',
}

function getActionSizeClass(action: ModalAction) {
    return actionSizeClassMap[action.size ?? 'md']
}

function onActionClick(action: ModalAction, index: number) {
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

            <section role="dialog" aria-modal="true" :aria-labelledby="title ? titleId : undefined"
                class="relative z-50 flex flex-col gap-4 w-full p-6 overflow-hidden rounded-2xl border
                border-gray-200 bg-gray-800 text-white shadow-2xl"
                :class="sizeClass">
                <header v-if="hasHeaderSlot || title || showCloseButton"
                    class="relative flex shrink-0 items-center justify-center">
                    <slot name="header">
                        <h2 v-if="title" :id="titleId"
                            class="style-headline-4 text-center text-gray-100 dark:text-white">
                            {{ title }}
                        </h2>
                        <span v-else class="min-w-0 flex-1" />

                        <button v-if="showCloseButton" type="button"
                            class="absolute right-0  inline-flex shrink-0 items-center justify-center rounded-full text-gray-100 dark:text-gray-400 transition-colors hover:bg-gray-300/20 hover:dark:bg-white/10 hover:dark:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-100 p-1.5"
                            aria-label="Close dialog" @click="close">
                            <span aria-hidden="true" class="inline-flex text-current">
                                <XIcon class="size-5"/>
                            </span>
                        </button>
                    </slot>
                </header>

                <article
                    class="style-body-2-regular min-h-0 flex-1 overflow-auto text-center text-gray-200 dark:text-gray-400">
                    <slot>
                        <p v-if="content">{{ content }}</p>
                    </slot>
                </article>

                <footer v-if="hasFooterSlot || hasActionButtons" class="shrink-0">
                    <slot name="footer" :close="close">
                        <div :class="actionContainerClass">
                            <CustomButton v-for="(action, index) in actions"
                                :key="action.id ?? `${action.label}-${index}`" :label="action.label"
                                :variant="action.variant ?? 'primary'" :disabled="action.disabled"
                                :class="getActionSizeClass(action)" @click="onActionClick(action, index)" />
                        </div>
                    </slot>
                </footer>
            </section>
        </div>
    </Teleport>
</template>
