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

router.beforeEach((to, from, next) => {
  store.setRequesting(true)
  next()
})

router.afterEach(() => {
  setTimeout(() => {
    store.setRequesting(false)
  }, 2800)
})
</script>

<template>
  <LoadingSpinner v-model:modelValue="isLoading">
    <RouterView />
  </LoadingSpinner>
</template>
