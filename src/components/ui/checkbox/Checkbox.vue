<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Check } from 'lucide-vue-next'
import {
  CheckboxIndicator,
  CheckboxRoot,
  useForwardPropsEmits,
  injectCheckboxRootContext,
} from 'reka-ui'
import { cn } from '@/lib/utils'

interface Props extends CheckboxRootProps {
  class?: HTMLAttributes['class']
  label?: string
}

const props = defineProps<Props>()
const emits = defineEmits<CheckboxRootEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'label')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <div class="flex items-center gap-2 cursor-pointer select-none group">
    <CheckboxRoot
      v-slot="slotProps"
      data-slot="checkbox"
      v-bind="forwarded"
      :class="
        cn(
          'relative size-5 rounded border transition-all',
          'border-gray-400 dark:border-gray-300',
          'group-hover:!border-white',
          'data-[state=checked]:border-3 data-[state=checked]:!border-blue-100 data-[state=checked]:bg-blue-100',
          'focus-visible:ring-2 focus-visible:ring-blue-400',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          props.class,
        )
      "
    >
      <CheckboxIndicator
        data-slot="checkbox-indicator"
        class="grid place-content-center text-white transition-none"
      >
        <slot v-bind="slotProps">
          <Check class="size-3.5" />
        </slot>
      </CheckboxIndicator>
    </CheckboxRoot>

    <span
      v-if="props.label"
      :class="cn('style-body-2-regular text-gray-300 transition-colors', 'group-hover:text-white')"
    >
      {{ props.label }}
    </span>
  </div>
</template>
