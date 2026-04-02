<script setup lang="ts">
import type { RadioGroupItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { CircleIcon } from 'lucide-vue-next'
import {
  RadioGroupIndicator,
  RadioGroupItem,
  useForwardProps,
  injectRadioGroupRootContext,
} from 'reka-ui'
import { cn } from '@/lib/utils'

interface Props extends /* @vue-ignore */ RadioGroupItemProps {
  class?: HTMLAttributes['class']
  label?: string
}

const props = defineProps<Props>()

const delegatedProps = reactiveOmit(props, 'class', 'label')
const forwardedProps = useForwardProps(delegatedProps)

const context = injectRadioGroupRootContext()
const isChecked = computed(() => context.modelValue?.value === props.value)
</script>

<template>
  <div
    class="flex items-center gap-2 cursor-pointer select-none group"
    :data-state="isChecked ? 'checked' : 'unchecked'"
  >
    <RadioGroupItem
      data-slot="radio-group-item"
      v-bind="forwardedProps"
      :class="
        cn(
          'relative size-5 rounded-full border transition-all',
          'border-gray-400 dark:border-gray-300',
          'group-hover:!border-white',
          'data-[state=checked]:border-3 data-[state=checked]:!border-blue-100',
          'focus-visible:ring-2 focus-visible:ring-blue-400',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          props.class,
        )
      "
    >
      <RadioGroupIndicator class="flex items-center justify-center">
        <CircleIcon class="size-2.5 text-blue-100 fill-blue-100" />
      </RadioGroupIndicator>
    </RadioGroupItem>

    <span
      class="style-body-2-regular text-gray-300 group-hover:text-white transition-colors group-data-[state=checked]:text-white disabled:text-gray-200"
    >
      {{ props.label }}
    </span>
  </div>
</template>
