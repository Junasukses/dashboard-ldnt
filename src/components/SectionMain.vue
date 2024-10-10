<script setup>
import { containerMaxW } from '@/config.js'
</script>

<template>
  <section class="p-6 pt-0" :class="containerMaxW">
    <slot />
  </section>
</template>
