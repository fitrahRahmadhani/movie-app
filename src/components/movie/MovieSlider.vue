<script setup>
import { formatImdb, formatYear, tmdbImage } from '@/utils/formatText'
import { ChevronLeft, ChevronRight, Star } from '@lucide/vue'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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

function panelPosition(index) {
  if (index === 0) return 'left-0 origin-left'
  if (index === props.movies.length - 1) return 'right-0 origin-right'
  return 'left-1/2 -translate-x-1/2'
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
  <section class="mx-auto flex w-full max-w-[1920px] flex-col py-12">
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
      <article
        v-for="(movie, i) in movies"
        :key="movie.id"
        class="group relative flex w-40 shrink-0 snap-start flex-col items-start gap-2 text-left text-white hover:z-20 sm:w-48 lg:w-56"
      >
        <img
          class="aspect-2/3 w-full rounded-lg bg-white/5 object-cover"
          :src="tmdbImage(movie.poster_path, 'w342')"
          :alt="movie.title"
          loading="lazy"
        />
        <p class="line-clamp-2 text-lg leading-tight">{{ movie.title }}</p>
        <p class="flex items-center gap-1 text-sm text-yellow-500">
          <Star fill="currentColor" :size="14" /> {{ formatImdb(movie.vote_average) }}
        </p>

        <div
          class="invisible absolute top-1/2 z-10 min-h-[calc(100%+4rem)] w-72 -translate-y-1/2 scale-90 overflow-hidden rounded-xl bg-neutral-900 text-left opacity-0 shadow-2xl shadow-black/60 transition duration-300 group-hover:visible group-hover:scale-100 group-hover:opacity-100"
          :class="panelPosition(i)"
        >
          <img
            class="aspect-square w-full object-cover"
            :src="tmdbImage(movie.backdrop_path ?? movie.poster_path, 'w780')"
            :alt="movie.title"
          />
          <div class="flex flex-col items-start gap-2 p-4">
            <h3 class="line-clamp-1 text-lg font-medium">{{ movie.title }}</h3>
            <div class="flex items-center gap-3 text-sm">
              <span class="flex items-center gap-1 text-yellow-500">
                <Star fill="currentColor" :size="14" /> {{ formatImdb(movie.vote_average) }}
              </span>
              <span class="text-white/70">{{ formatYear(movie.release_date) }}</span>
            </div>
            <p class="line-clamp-5 text-sm text-white/70">{{ movie.overview }}</p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
