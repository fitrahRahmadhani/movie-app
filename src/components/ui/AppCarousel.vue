<script setup>
import { ChevronLeft, ChevronRight, Pause, Play } from '@lucide/vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  autoPlay: { type: Boolean, default: true },
  interval: { type: Number, default: 3000 },
  label: { type: String, default: 'Carousel' },
})

const activeIndex = ref(0)
const isPaused = ref(false)
const isFocused = ref(false)
const isPageHidden = ref(false)
let timer
let touchStart

function stopAutoPlay() {
  clearInterval(timer)
  timer = undefined
}

function startAutoPlay() {
  stopAutoPlay()
  if (
    !props.autoPlay ||
    props.items.length < 2 ||
    isPaused.value ||
    isFocused.value ||
    isPageHidden.value
  ) {
    return
  }

  timer = setInterval(
    () => {
      activeIndex.value = (activeIndex.value + 1) % props.items.length
    },
    Math.max(1000, props.interval),
  )
}

function navigate(direction) {
  if (props.items.length < 2) return
  activeIndex.value = (activeIndex.value + direction + props.items.length) % props.items.length
  startAutoPlay()
}

function handleFocusIn(event) {
  isFocused.value = event.target.matches(':focus-visible')
}

function handleFocusOut(event) {
  isFocused.value = event.currentTarget.contains(event.relatedTarget)
}

function handleVisibilityChange() {
  isPageHidden.value = document.hidden
}

function handleTouchStart(event) {
  const touch = event.touches[0]
  touchStart = touch ? { x: touch.clientX, y: touch.clientY } : undefined
  stopAutoPlay()
}

function handleTouchEnd(event) {
  const touch = event.changedTouches[0]
  if (touchStart && touch) {
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      navigate(deltaX < 0 ? 1 : -1)
    }
  }
  cancelTouch()
}

function cancelTouch() {
  touchStart = undefined
  startAutoPlay()
}

watch(
  () => props.items.length,
  (count) => {
    if (activeIndex.value >= count) activeIndex.value = 0
    startAutoPlay()
  },
)

watch(
  [() => props.autoPlay, () => props.interval, isPaused, isFocused, isPageHidden],
  startAutoPlay,
)

onMounted(() => {
  isPaused.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  handleVisibilityChange()
  document.addEventListener('visibilitychange', handleVisibilityChange)
  startAutoPlay()
})

onBeforeUnmount(() => {
  stopAutoPlay()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <section
    v-if="items.length"
    class="relative isolate overflow-hidden focus-visible:outline-2 focus-visible:outline-primary"
    role="region"
    aria-roledescription="carousel"
    :aria-label="label"
    tabindex="0"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @keydown.left.prevent="navigate(-1)"
    @keydown.right.prevent="navigate(1)"
    @touchstart.passive="handleTouchStart"
    @touchend.passive="handleTouchEnd"
    @touchcancel.passive="cancelTouch"
  >
    <div class="grid" :aria-live="!autoPlay || isPaused || isFocused ? 'polite' : 'off'">
      <Transition name="carousel-fade">
        <div
          :key="activeIndex"
          class="carousel-slide min-w-0"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${activeIndex + 1} dari ${items.length}`"
        >
          <slot :item="items[activeIndex]" :index="activeIndex" />
        </div>
      </Transition>
    </div>

    <div
      v-if="items.length > 1"
      class="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-white backdrop-blur-sm"
    >
      <button
        type="button"
        class="carousel-control"
        aria-label="Slide sebelumnya"
        @click="navigate(-1)"
      >
        <ChevronLeft :size="20" aria-hidden="true" />
      </button>
      <span class="min-w-14 text-center text-sm tabular-nums">
        {{ activeIndex + 1 }} / {{ items.length }}
      </span>
      <button
        type="button"
        class="carousel-control"
        aria-label="Slide berikutnya"
        @click="navigate(1)"
      >
        <ChevronRight :size="20" aria-hidden="true" />
      </button>
      <button
        v-if="autoPlay"
        type="button"
        class="carousel-control"
        :aria-label="isPaused ? 'Putar otomatis' : 'Jeda putar otomatis'"
        @click="isPaused = !isPaused"
      >
        <Play v-if="isPaused" :size="18" aria-hidden="true" />
        <Pause v-else :size="18" aria-hidden="true" />
      </button>
    </div>
  </section>
</template>

<style scoped>
.carousel-slide {
  grid-area: 1 / 1;
}

.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: opacity 600ms ease-in-out;
}

.carousel-fade-enter-from,
.carousel-fade-leave-to {
  opacity: 0;
}

.carousel-fade-leave-active {
  pointer-events: none;
}

.carousel-control {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 150ms;
}

.carousel-control:hover {
  background: rgb(255 255 255 / 15%);
}

.carousel-control:focus-visible {
  outline: 2px solid white;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .carousel-fade-enter-active,
  .carousel-fade-leave-active,
  .carousel-control {
    transition: none;
  }
}
</style>
