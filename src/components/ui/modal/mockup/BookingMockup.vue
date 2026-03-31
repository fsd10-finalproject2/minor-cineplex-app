<script lang="ts">
export default{
  name:"BookingMockup"
}
</script>

<template>
  <section class="text-left space-y-5">

    <!-- ── Top: Movie Info ── -->
    <div class="flex gap-5">
      <!-- Poster -->
      <div class="w-[100px] h-[140px] shrink-0 rounded-lg overflow-hidden bg-gray-400/20">
        <img src="https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911BytUy5Knfk5J.jpg" alt="The Dark Knight poster"
          class="w-full h-full object-cover" />
      </div>

      <!-- Movie details -->
      <div class="flex-1 flex flex-col justify-center gap-1.5">
        <h3 class="style-headline-4 text-gray-100">The Dark Knight</h3>
        <div class="flex items-center gap-2">
          <PinIcon class="size-4 text-blue-200 shrink-0" />
          <span class="style-body-3 text-gray-200">Minor Cineplex Arkham</span>
        </div>
        <div class="flex items-center gap-2">
          <CalendarIcon class="size-4 text-gray-300 shrink-0" />
          <span class="style-body-3 text-gray-200">24 Jun 2024</span>
        </div>
        <div class="flex items-center gap-2">
          <ClockLineIcon class="size-4 text-gray-300 shrink-0" />
          <span class="style-body-3 text-gray-200">16:30</span>
        </div>
        <div class="flex items-center gap-2">
          <ShopIcon class="size-4 text-gray-300 shrink-0" />
          <span class="style-body-3 text-gray-200">Hall 1</span>
        </div>
      </div>

      <!-- Booking meta (top-right) -->
      <div class="text-right shrink-0 space-y-0.5">
        <p class="style-body-3 text-gray-300">Booking No. &nbsp;<span class="text-gray-100 font-semibold">AK11223</span>
        </p>
        <p class="style-body-3 text-gray-300">Booked date &nbsp;<span class="text-gray-100 font-semibold">24 Jun
            2024</span></p>
      </div>
    </div>

    <!-- ── Divider ── -->
    <hr class="border-gray-400/30" />

    <!-- ── Ticket / Seat / Payment row ── -->
    <div class="flex items-center gap-4">
      <!-- Ticket badge -->
      <div class="px-4 py-2 rounded-lg border border-gray-400/40 bg-gray-400/10">
        <span class="style-body-1-medium text-gray-100">2 Tickets</span>
      </div>

      <!-- Seat & payment info -->
      <div class="flex-1 space-y-0.5">
        <p class="style-body-3 text-gray-300">Selected Seat &nbsp;&nbsp; <span class="text-gray-100 font-semibold">C9,
            C10</span></p>
        <p class="style-body-3 text-gray-300">Payment method &nbsp;&nbsp; <span
            class="text-gray-100 font-semibold">Credit card</span></p>
      </div>

      <!-- Paid badge -->
      <span
        class="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase tracking-wide">Paid</span>
    </div>

    <!-- ── Divider ── -->
    <hr class="border-gray-400/30" />

    <!-- ── Payment breakdown ── -->
    <div class="flex gap-12">
      <div class="flex-1 space-y-2.5">
        <div class="flex justify-between">
          <span class="style-body-2-regular text-gray-200">Payment method</span>
          <span class="style-body-2-medium text-gray-100">Credit card</span>
        </div>
        <div class="flex justify-between">
          <span class="style-body-2-regular text-gray-200">Ticket x2</span>
          <span class="style-body-2-medium text-gray-100">THB300</span>
        </div>
        <div class="flex justify-between">
          <span class="style-body-2-regular text-gray-200">Coupon</span>
          <span class="style-body-2-medium text-emerald-400">-THB50</span>
        </div>
        <div class="flex justify-between pt-1 border-t border-gray-400/20">
          <span class="style-body-2-regular text-gray-200">Total</span>
          <span class="style-body-1-medium text-gray-100">THB250</span>
        </div>
      </div>

      <!-- Cancel button -->
      <div class="flex items-end">
        <button
          class="px-8 py-2.5 rounded-lg border border-gray-400/60 text-gray-200 style-body-2-medium hover:border-red-400 hover:text-red-400 transition-colors cursor-pointer">
          Cancel booking
        </button>
      </div>
    </div>

  </section>
</template>
