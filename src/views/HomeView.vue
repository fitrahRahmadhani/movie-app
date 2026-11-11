<script setup>
import MovieSlider from '@/components/movie/MovieSlider.vue'
import AppCarousel from '@/components/ui/AppCarousel.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { movieApi } from '@/services/movieApi'
import { formatImdb, formatYear, tmdbImage } from '@/utils/formatText'
import { Play, Star } from '@lucide/vue'
import { onMounted, ref } from 'vue'

const nowPlayingMovies = ref([])
const trendingMovies = ref([])
const topRatedMovies = ref([])

onMounted(async () => {
  const [nowPlaying, trending, topRated] = await Promise.allSettled([
    movieApi.getNowPlaying(),
    movieApi.getTrandingMovies(),
    movieApi.getTopRatedMovies(),
  ])

  if (nowPlaying.status === 'fulfilled') {
    nowPlayingMovies.value = nowPlaying.value.results.filter((m) => m.backdrop_path)
  } else {
    console.error(nowPlaying.reason)
  }

  if (trending.status === 'fulfilled') {
    trendingMovies.value = trending.value.results.filter((m) => m.poster_path)
  } else {
    console.error(trending.reason)
  }

  if (topRated.status === 'fulfilled') {
    topRatedMovies.value = topRated.value.results.filter((m) => m.poster_path)
  }
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

    <MovieSlider v-if="trendingMovies.length" title="Sedang Populer" :movies="trendingMovies" />
    <MovieSlider v-if="topRatedMovies.length" title="Top Rated" :movies="topRatedMovies" />
  </DefaultLayout>
</template>
