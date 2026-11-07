<script setup>
import AppCarousel from '@/components/ui/AppCarousel.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { movieApi } from '@/services/movieApi'
import { formatImdb, formatYear, tmdbImage } from '@/utils/formatText'
import { Play, Star } from '@lucide/vue'
import { onMounted, ref } from 'vue'

const movies = ref([])

onMounted(async () => {
  try {
    const data = await movieApi.getNowPlaying()
    movies.value = data.results
  } catch (err) {
    console.log(err)
  } finally {
    console.log('Done')
  }
})
</script>

<template>
  <DefaultLayout>
    <AppCarousel
      v-if="movies.length"
      :items="movies"
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
            class="w-full h-full object-cover"
            :src="tmdbImage(item.backdrop_path, 'w1280')"
            :alt="item.title"
          />
          <div
            class="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent"
          ></div>
          <div class="absolute inset-x-4 bottom-28 sm:inset-x-8 lg:left-20 lg:right-auto lg:w-2/3">
            <div class="flex items-center gap-2">
              <p
                class="flex items-center gap-1 text-yellow-500 px-2 py-1 bg-yellow-500/20 rounded-lg w-fit"
              >
                <Star fill="currentColor" :size="16" /> IMDb {{ formatImdb(item.vote_average) }}
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
              class="flex items-center gap-2 mt-8 shrink-0 rounded-lg bg-primary px-6 py-3 font-medium text-xl whitespace-nowrap text-white shadow-lg shadow-primary/50"
            >
              <Play :size="20" />
              Putar Sekarang
            </button>
          </div>
        </div>
      </template>
    </AppCarousel>
  </DefaultLayout>
</template>
