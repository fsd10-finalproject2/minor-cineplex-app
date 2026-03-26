<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useTheme } from '@/composables/useTheme'
import CustomButton from '@/components/ui/CustomButton.vue'
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClockFillIcon,
  ClockLineIcon,
  CopyIcon,
  DoneIcon,
  EditIcon,
  HamburgerIcon,
  NewTabIcon,
  NoteBookIcon,
  PinIcon,
  PlusIcon,
  SearchIcon,
  ShopIcon,
  SignOutIcon,
  StarFillIcon,
  StarIcon,
  TicketIcon,
  UserIcon,
  XIcon,
  RefreshIcon,
  CalendarRangeIcon,
} from '@/assets/icons'

const { toggleTheme } = useTheme()

// ── Sub-components ─────────────────────────────────────────────────────

const SectionTitle = defineComponent({
  setup(_, { slots }) {
    return () =>
      h('div', { class: 'mb-6' }, [
        h('h2', { class: 'style-headline-3 mb-1 text-base' }, slots.default?.()),
        h('div', {
          class: 'h-px mt-3 bg-gray-400 dark:bg-gray-200',
        }),
      ])
  },
})

const TypeRow = defineComponent({
  props: { label: String, sub: String },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class: 'flex items-baseline gap-6 py-4 border-b border-gray-400/50 dark:border-gray-100',
        },
        [
          h('div', { class: 'w-52 shrink-0' }, [
            h('code', { class: 'style-body-3 text-blue-100' }, props.label),
            h('p', { class: 'style-body-3 mt-0.5 text-gray-200 dark:text-gray-300' }, props.sub),
          ]),
          h('div', { class: 'text-base' }, slots.default?.()),
        ],
      )
  },
})
</script>

<template>
  <div class="min-h-screen p-10 bg-base text-base transition-colors duration-300">
    <!-- Header -->
    <header
      class="mb-16 pb-8 flex items-start justify-between border-b border-gray-400 dark:border-gray-200"
    >
      <div>
        <p class="style-label text-blue-100 uppercase tracking-widest mb-2">Design System</p>

        <h1 class="style-headline-1 text-base">CSS Token Test Page</h1>

        <p class="style-body-1-regular mt-3 max-w-xl text-gray-200 dark:text-gray-300">
          A visual reference for all typography styles, color tokens, and utility classes defined in
          <code class="text-blue-100 px-1.5 py-0.5 rounded text-sm bg-gray-400/30 dark:bg-gray-100">
            main.css </code
          >.
        </p>
      </div>

      <!-- Theme Toggle -->
      <button
        @click="toggleTheme"
        class="flex items-center gap-2 px-4 py-2 rounded-full border style-body-2-medium transition-all cursor-pointer border-gray-400 text-gray-200 hover:border-blue-100 hover:text-base dark:border-gray-200 dark:text-gray-300 dark:hover:text-white"
      >
        <span>🌗</span>
        <span>Toggle Theme</span>
      </button>
    </header>

    <!-- Typography -->
    <section class="mb-16">
      <SectionTitle>Typography</SectionTitle>
      <div class="space-y-2">
        <TypeRow label="style-headline-1" sub="56px / Bold">
          <span class="style-headline-1">Headline 1</span>
        </TypeRow>
        <TypeRow label="style-headline-2" sub="36px / Bold">
          <span class="style-headline-2">Headline 2</span>
        </TypeRow>
        <TypeRow label="style-headline-3" sub="24px / Bold">
          <span class="style-headline-3">Headline 3</span>
        </TypeRow>
        <TypeRow label="style-headline-4" sub="20px / Bold">
          <span class="style-headline-4">Headline 4</span>
        </TypeRow>
        <TypeRow label="style-body-1-medium" sub="16px / Medium">
          <span class="style-body-1-medium">The quick brown fox jumps over the lazy dog</span>
        </TypeRow>
        <TypeRow label="style-body-1-regular" sub="16px / Regular">
          <span class="style-body-1-regular">The quick brown fox jumps over the lazy dog</span>
        </TypeRow>
      </div>
    </section>

    <!-- Form -->
    <section class="mb-16">
      <SectionTitle>Form Elements</SectionTitle>

      <div class="max-w-md space-y-5">
        <div>
          <label class="style-label block mb-1.5 text-gray-200 dark:text-gray-300">
            Email address
          </label>

          <input
            type="email"
            placeholder="user@example.com"
            class="style-input w-full border rounded-lg px-4 py-3 outline-none transition-all bg-gray-400/20 text-base border-gray-400 dark:bg-gray-100 dark:text-white dark:border-gray-200"
          />

          <p class="style-help-text mt-1.5 text-gray-200 dark:text-gray-300">
            We'll never share your email.
          </p>
        </div>

        <div class="flex gap-3">
          <CustomButton disabled> 💾 Save </CustomButton>

          <CustomButton variant="secondary"> Secondary </CustomButton>

          <CustomButton variant="ghost"> Ghost </CustomButton>

          <CustomB />
        </div>
      </div>
      <CalendarIcon class="size-20" />
      <ChevronDownIcon class="size-20 text-blue-200" />
      <ChevronLeftIcon />
      <ChevronRightIcon />
      <ChevronUpIcon />
      <ClockFillIcon />
      <ClockLineIcon />
      <CopyIcon />
      <DoneIcon />
      <EditIcon />
      <HamburgerIcon />
      <NewTabIcon />
      <NoteBookIcon />
      <PinIcon />
      <PlusIcon />
      <SearchIcon />
      <ShopIcon />
      <SignOutIcon />
      <StarFillIcon />
      <StarIcon />
      <TicketIcon />
      <UserIcon />
      <XIcon />
      <RefreshIcon />
      <CalendarRangeIcon />
    </section>
  </div>
</template>
