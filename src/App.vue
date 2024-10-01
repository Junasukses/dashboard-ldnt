<script setup>
import { ref, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { useStore } from '@/stores/app.js'

const router = useRouter()
const store = useStore()
const isLoading = ref(false)

watch(
  () => store.isRequesting,
  (newValue) => {
    isLoading.value = newValue
  }
)
</script>

<template>
  <LoadingSpinner v-model:modelValue="isLoading" />
  <RouterView />
</template>
