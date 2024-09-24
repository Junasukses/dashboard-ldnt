<script setup>
import { computed, useSlots, ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: null
  },
  labelFor: {
    type: String,
    default: null
  },
  help: {
    type: String,
    default: null
  },
  slotClass: {
    type: String,
    default: ''
  }
})

const slots = useSlots()

const slotsLength = ref(slots.default().length)

const wrapperClass = computed(() => {
  const base = []

  if (slotsLength.value > 1) {
    base.push(`grid grid-cols-1 gap-3 md:grid-cols-2`)
  }

  if (props.slotClass) {
    base.push(props.slotClass)
  }

  return base
})
</script>

<template>
  <div class="mb-6 last:mb-0">
    <label v-if="label && slotsLength == 1" :for="labelFor" class="block font-bold mb-2">{{
      label
    }}</label>
    <div :class="wrapperClass">
      <slot />
    </div>
    <div v-if="help" class="text-xs text-gray-500 dark:text-slate-400 mt-1">
      {{ help }}
    </div>
  </div>
</template>
