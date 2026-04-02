<template>
  <div class="bg-[#0f1623] text-white rounded-2xl p-4 flex flex-col gap-4">
    <!-- Countdown -->
    <div class="flex items-center gap-2 text-sm">
      <span class="text-slate-400">Time remaining:</span>
      <span class="text-blue-400 font-medium">04:55</span>
    </div>

    <!-- Movie Info -->
    <div class="flex gap-3">
      <img
        src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/The_Dark_Knight_%282008_film%29.jpg/220px-The_Dark_Knight_%282008_film%29.jpg"
        alt="The Dark Knight"
        class="w-20 h-28 rounded-lg object-cover flex-shrink-0"
      />
      <div class="flex flex-col justify-start gap-2 pt-1">
        <p class="text-white font-semibold text-base leading-snug">The Dark Knight</p>
        <div class="flex flex-wrap gap-1.5">
          <span class="text-xs px-3 py-1 rounded-full border border-white/20 text-slate-300"
            >Action</span
          >
          <span class="text-xs px-3 py-1 rounded-full border border-white/20 text-slate-300"
            >Crime</span
          >
          <span class="text-xs px-3 py-1 rounded-full bg-blue-500 text-white font-medium">TH</span>
        </div>
      </div>
    </div>

    <!-- Booking Details -->
    <div class="flex flex-col gap-2.5">
      <div class="flex items-center gap-3 text-sm text-slate-300">
        <svg class="w-4 h-4 shrink-0 text-slate-400" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="7" r="2.5" stroke="currentColor" stroke-width="1.3" />
          <path
            d="M8 1C4.5 1 2 4 2 7c0 4 6 8 6 8s6-4 6-8c0-3-2.5-6-6-6z"
            stroke="currentColor"
            stroke-width="1.3"
          />
        </svg>
        Minor Cineplex Arkham
      </div>
      <div class="flex items-center gap-3 text-sm text-slate-300">
        <svg class="w-4 h-4 shrink-0 text-slate-400" viewBox="0 0 16 16" fill="none">
          <rect
            x="2"
            y="3"
            width="12"
            height="11"
            rx="2"
            stroke="currentColor"
            stroke-width="1.3"
          />
          <path d="M5 1v4M11 1v4M2 7h12" stroke="currentColor" stroke-width="1.3" />
        </svg>
        24 Jun 2024
      </div>
      <div class="flex items-center gap-3 text-sm text-slate-300">
        <svg class="w-4 h-4 shrink-0 text-slate-400" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3" />
          <path
            d="M8 5v3.5l2.5 1.5"
            stroke="currentColor"
            stroke-width="1.3"
            stroke-linecap="round"
          />
        </svg>
        16:30
      </div>
      <div class="flex items-center gap-3 text-sm text-slate-300">
        <svg class="w-4 h-4 shrink-0 text-slate-400" viewBox="0 0 16 16" fill="none">
          <rect
            x="1"
            y="4"
            width="14"
            height="9"
            rx="1.5"
            stroke="currentColor"
            stroke-width="1.3"
          />
          <path
            d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"
            stroke="currentColor"
            stroke-width="1.3"
          />
        </svg>
        Hall 1
      </div>
    </div>

    <div class="border-t border-white/10" />

    <!-- Coupon Section -->
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-slate-300">Coupon</span>
        <svg class="w-4 h-4 text-slate-400" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div
        class="flex items-center justify-between bg-[#1a2235] border border-white/10 rounded-lg px-3 py-2.5"
      >
        <span class="text-sm text-slate-300 truncate"
          >Merry March Magic – Get 50 THB Off! (...</span
        >
        <button class="text-slate-400 hover:text-white transition-colors ml-2 shrink-0">✕</button>
      </div>
    </div>

    <div class="border-t border-white/10" />

    <!-- Price Summary -->
    <div class="flex flex-col gap-3">
      <div class="flex justify-between text-sm">
        <span class="text-slate-400">Selected Seat</span>
        <span class="text-white font-medium">C9, C10</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-slate-400">Payment method</span>
        <span class="text-white font-medium">Credit card</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-slate-400">Coupon</span>
        <span class="text-red-400 font-medium">-THB50</span>
      </div>
      <div class="flex justify-between text-sm font-semibold">
        <span class="text-white">Total</span>
        <span class="text-white">THB300</span>
      </div>
    </div>

    <!-- Next Button -->
    <button
      class="w-full bg-blue-600/50 hover:bg-blue-500 text-white/60 hover:text-white text-sm font-medium rounded-xl py-3 transition-all"
    >
      Next
    </button>
  </div>
</template>
