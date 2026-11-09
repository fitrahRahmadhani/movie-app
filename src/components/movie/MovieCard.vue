<script setup>
import { formatImdb, formatYear, tmdbImage } from '@/utils/formatText'
import { Star } from '@lucide/vue'
import { computed } from 'vue'

const props = defineProps({
  movie: { type: Object, required: true },
  position: {
    type: String,
    default: 'middle',
    validator: (v) => ['first', 'middle', 'last'].includes(v),
  },
})

const panelClass = computed(() => {
  if (props.position === 'first') return 'left-0 origin-left'
  if (props.position === 'last') return 'right-0 origin-right'
  return 'left-1/2 -translate-x-1/2'
})
</script>

<template>
  <article
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
      :class="panelClass"
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
</template>
