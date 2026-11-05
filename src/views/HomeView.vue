<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Search } from '@lucide/vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <DefaultLayout>
    <header class="w-full h-20 bg-[#121317B8]">
      <div class="w-full max-w-360 h-full mx-auto flex justify-between items-center px-6">
        <div>CINEMASTRAM</div>
        <div class="flex items-center gap-10">
          <RouterLink :to="home" class="py-2 px-4 bg-red-500 rounded-2xl font-semibold text-white"
            >Beranda</RouterLink
          >
          <RouterLink :to="home" class="text-[#E9BCB6]">Jelajah</RouterLink>
          <RouterLink :to="home" class="text-[#E9BCB6]">Film Populer</RouterLink>
        </div>
        <div>
          <label
            for="search-bar"
            class="flex items-center gap-2 bg-[#292a2e] py-2 px-4 rounded-full text-[#E9BCB6] focus-within:ring-1 focus-within:ring-[#E9BCB6]/50 transition-shadow"
          >
            <Search :size="18" />
            <input
              id="search-bar"
              type="text"
              placeholder="Cari film, serial, aktor..."
              class="w-60 text-sm outline-none"
              aria-label="Cari Film"
              autocomplete="off"
            />
          </label>
        </div>
      </div>
    </header>
  </DefaultLayout>
</template>
