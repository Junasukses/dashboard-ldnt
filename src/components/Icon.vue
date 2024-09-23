<template>
  <FontAwesomeIcon
    class="fa-fw page-length-selector"
    :class="'fa-' + prop.size"
    :icon="['fas', prop.fa]"
    :title="title"
    @click="$emit('click')"
    :size="sizeProp"
  />
</template>
<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const prop = defineProps({
  sizeProp: {
    type: String,
    default: 'sm'
  },
  title: {
    type: String,
    default: ''
  },
  fa: {
    type: String,
    default: 'cog'
  },
  size: {
    type: String,
    default: 'md'
  }
})
</script>
<!-- bg-gray-600 -->
