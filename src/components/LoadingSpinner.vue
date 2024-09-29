<template>
  <div v-if="modelValue" class="flex items-center justify-center flex-col h-screen">
    <div class="w-52 h-52">
      <Vue3Lottie animationLink="/data-sources/loading.json" />
    </div>
    <div class="text-center text-slate-800">Loading</div>
  </div>
  <slot v-else></slot>
</template>

<script setup>
import { defineProps } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
</script>
