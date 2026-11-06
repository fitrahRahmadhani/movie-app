<script setup lang="ts">
import TheHeader from '@/components/ui/TheHeader.vue'
</script>

<template>
  <div class="min-h-screen w-full bg-black">
    <TheHeader />
    <slot></slot>
  </div>
</template>
