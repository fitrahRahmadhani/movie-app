<script setup>
import AppCarousel from '@/components/ui/AppCarousel.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { movieApi } from '@/services/movieApi'
import { formatImdb, formatYear, tmdbImage } from '@/utils/formatText'
import { ChevronLeft, ChevronRight, Play, Star } from '@lucide/vue'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const nowPlayingMovies = ref([])
const trendingMovies = ref([])

const trendingRow = ref(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

function updateScrollState() {
  const el = trendingRow.value
  if (!el) return
  canScrollPrev.value = el.scrollLeft > 0
  canScrollNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

function scrollRow(direction) {
  const el = trendingRow.value
  if (!el) return
  el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
}

function panelPosition(index) {
  if (index === 0) return 'left-0 origin-left'
  if (index === trendingMovies.value.length - 1) return 'right-0 origin-right'
  return 'left-1/2 -translate-x-1/2'
}

onMounted(async () => {
  window.addEventListener('resize', updateScrollState)

  const [nowPlaying, trending] = await Promise.allSettled([
    movieApi.getNowPlaying(),
    movieApi.getTrandingMovies(),
  ])

  if (nowPlaying.status === 'fulfilled') {
    nowPlayingMovies.value = nowPlaying.value.results.filter((m) => m.backdrop_path)
  } else {
    console.error(nowPlaying.reason)
  }

  if (trending.status === 'fulfilled') {
    trendingMovies.value = trending.value.results.filter((m) => m.poster_path)
    await nextTick()
    updateScrollState()
  } else {
    console.error(trending.reason)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollState)
})
</script>

<template>
  <DefaultLayout>
    <AppCarousel
      v-if="nowPlayingMovies.length"
      :items="nowPlayingMovies"
      :auto-play="true"
      :interval="5000"
      label="Film yang sedang tayang"
    >
      <template #default="{ item }">
        <div
          class="relative isolate mx-auto h-svh min-h-144 max-h-270 w-full max-w-[1920px] overflow-hidden bg-black"
        >
          <img
            class="absolute inset-0 -z-10 h-full w-full scale-110 object-cover opacity-60 blur-3xl saturate-150"
            :src="tmdbImage(item.backdrop_path, 'w300')"
            alt=""
            aria-hidden="true"
          />
          <img
            class="h-full w-full object-cover"
            :src="tmdbImage(item.backdrop_path, 'w1280')"
            :alt="item.title"
          />
          <div
            class="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent"
          ></div>
          <div class="absolute inset-x-4 bottom-28 sm:inset-x-8 lg:left-20 lg:right-auto lg:w-2/3">
            <div class="flex items-center gap-2">
              <p
                class="flex w-fit items-center gap-1 rounded-lg bg-yellow-500/20 px-2 py-1 text-yellow-500"
              >
                <Star fill="currentColor" :size="16" /> TMDB {{ formatImdb(item.vote_average) }}
              </p>
              <p class="text-white">{{ formatYear(item.release_date) }}</p>
            </div>
            <p class="my-4 font-bebas text-5xl leading-none text-white sm:text-7xl lg:text-9xl">
              {{ item.title }}
            </p>
            <p class="line-clamp-4 text-base text-white sm:text-lg lg:text-xl">
              {{ item.overview }}
            </p>
            <button
              class="mt-8 flex shrink-0 items-center gap-2 rounded-lg bg-primary px-6 py-3 text-xl font-medium whitespace-nowrap text-white shadow-lg shadow-primary/50"
            >
              <Play :size="20" />
              Putar Sekarang
            </button>
          </div>
        </div>
      </template>
    </AppCarousel>

    <section v-if="trendingMovies.length" class="mx-auto flex w-full max-w-[1920px] flex-col py-12">
      <div class="relative z-10 flex items-center justify-between px-8 lg:px-20">
        <div class="flex items-center gap-2">
          <div class="h-10 w-2 rounded-2xl bg-primary"></div>
          <h2 class="text-left font-bebas text-4xl leading-none text-white">Sedang populer</h2>
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
        ref="trendingRow"
        class="-mt-4 -mb-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-8 py-10 scroll-px-8 lg:px-20 lg:scroll-px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        @scroll.passive="updateScrollState"
      >
        <article
          v-for="(movie, i) in trendingMovies"
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
  </DefaultLayout>
</template>
