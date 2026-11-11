<script setup>
import { ChevronLeft, ChevronRight, Star } from '@lucide/vue'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import MovieCard from './MovieCard.vue'

const props = defineProps({
  title: { type: String, required: true },
  movies: { type: Array, default: () => [] },
})

const row = ref(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

function updateScrollState() {
  const el = row.value
  if (!el) return
  canScrollPrev.value = el.scrollLeft > 0
  canScrollNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

function scrollRow(direction) {
  const el = row.value
  if (!el) return
  el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
}

function cardPosition(i) {
  if (i === 0) return 'first'
  if (i === props.movies.length - 1) return 'last'
  return 'middle'
}

watch(
  () => props.movies.length,
  async () => {
    await nextTick()
    updateScrollState()
  },
)

onMounted(() => {
  window.addEventListener('resize', updateScrollState)
  updateScrollState()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollState)
})
</script>

<template>
  <section class="mx-auto flex w-full max-w-[1920px] flex-col py-6">
    <div class="relative z-10 flex items-center justify-between px-8 lg:px-20">
      <div class="flex items-center gap-2">
        <div class="h-10 w-2 rounded-2xl bg-primary"></div>
        <h2 class="text-left font-bebas text-4xl leading-none text-white">{{ title }}</h2>
      </div>
      <div class="flex gap-4 text-white">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition duration-300 hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/10"
          aria-label="Geser ke kiri"
          :disabled="!canScrollPrev"
          @click="scrollRow(-1)"
        >
          <ChevronLeft :size="20" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition duration-300 hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/10"
          aria-label="Geser ke kanan"
          :disabled="!canScrollNext"
          @click="scrollRow(1)"
        >
          <ChevronRight :size="20" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div
      ref="row"
      class="-mt-4 -mb-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-8 py-10 scroll-px-8 lg:px-20 lg:scroll-px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @scroll.passive="updateScrollState"
    >
      <MovieCard
        v-for="(movie, i) in movies"
        :key="movie.id"
        :movie="movie"
        :position="cardPosition(i)"
      />
    </div>
  </section>
</template>
