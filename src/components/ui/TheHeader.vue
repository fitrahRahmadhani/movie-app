<script setup>
import { Search } from '@lucide/vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="w-full bg-[#121317B8]">
    <div
      class="mx-auto grid w-full max-w-360 grid-cols-1 items-center gap-4 px-4 py-4 sm:grid-cols-[auto_1fr] sm:px-6 lg:min-h-20 lg:grid-cols-[auto_1fr_auto] lg:gap-6 lg:py-0"
    >
      <h1 class="shrink-0 font-bebas text-4xl text-white sm:text-5xl">CINESTAR</h1>
      <nav
        aria-label="Navigasi utama"
        class="flex min-w-0 items-center justify-between gap-1 text-sm tracking-wider sm:justify-end sm:gap-4 sm:text-base lg:justify-center xl:gap-10"
      >
        <RouterLink
          :to="{ name: 'home' }"
          class="shrink-0 rounded-lg bg-primary px-4 py-2 font-medium whitespace-nowrap text-white shadow-lg shadow-primary/50"
          >Beranda</RouterLink
        >
        <RouterLink :to="{ name: 'home' }" class="px-2 py-2 whitespace-nowrap text-[#E9BCB6]"
          >Jelajah</RouterLink
        >
        <RouterLink :to="{ name: 'home' }" class="px-2 py-2 whitespace-nowrap text-[#E9BCB6]"
          >Film Populer</RouterLink
        >
      </nav>
      <div class="min-w-0 sm:col-span-2 lg:col-span-1 lg:w-64 xl:w-72">
        <label
          for="search-bar"
          class="flex items-center gap-2 bg-[#292a2e] py-2 px-4 rounded-full text-[#E9BCB6] focus-within:ring-1 focus-within:ring-[#E9BCB6]/50 transition-shadow"
        >
          <Search :size="18" class="shrink-0" aria-hidden="true" />
          <input
            id="search-bar"
            type="text"
            placeholder="Cari film, serial, aktor..."
            class="min-w-0 w-full bg-transparent text-sm outline-none"
            aria-label="Cari Film"
            autocomplete="off"
          />
        </label>
      </div>
    </div>
  </header>
</template>
