<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useMainStore } from '@/stores/main'
import 'vue-select/dist/vue-select.css'

const props = defineProps({
  name: {
    type: String,
    default: null
  },
  id: {
    type: String,
    default: null
  },
  autocomplete: {
    type: String,
    default: null
  },
  maxlength: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: null
  },
  inputmode: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  options: {
    type: Array,
    default: null
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: ''
  },
  required: Boolean,
  borderless: Boolean,
  transparent: Boolean,
  ctrlKFocus: Boolean
})

const emit = defineEmits(['update:modelValue', 'setRef'])

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const inputElClass = computed(() => {
  const base = [
    'px-3 py-0 max-w-full focus:ring-1 focus:outline-none border-gray-700 rounded-lg w-full text-sm',
    'dark:placeholder-gray-400',
    props.borderless ? 'border-0' : 'border',
    props.transparent ? 'bg-transparent' : 'bg-white dark:bg-slate-800'
  ]

  if (props.icon) {
    base.push('pl-10')
  }

  return base
})

const mainStore = useMainStore()

const selectEl = ref(null)

onMounted(() => {
  if (selectEl.value) {
    emit('setRef', selectEl.value)
  }
})

if (props.ctrlKFocus) {
  const fieldFocusHook = (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault()
      inputEl.value.focus()
    } else if (e.key === 'Escape') {
      inputEl.value.blur()
    }
  }

  onMounted(() => {
    if (!mainStore.isFieldFocusRegistered) {
      window.addEventListener('keydown', fieldFocusHook)
      mainStore.isFieldFocusRegistered = true
    } else {
      // console.error('Duplicate field focus event')
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', fieldFocusHook)
    mainStore.isFieldFocusRegistered = false
  })
}
</script>

<style scoped>
>>> {
  --vs-controls-color: #374151;
  --vs-controls-size: 0.8;
  --vs-border-color: #374151;

  --vs-dropdown-bg: #fff;
  --vs-dropdown-color: #fff;
  --vs-dropdown-option-color: #000000;

  --vs-selected-bg: #374151;
  --vs-selected-color: #000000;

  --vs-search-input-color: #000000;

  --vs-dropdown-option--active-bg: #5897fb;
  --vs-dropdown-option--active-color: #000000;
  --vs-font-size: 0.875rem;
  --vs-line-height: 1.8rem;
  --vs-border-radius: 0.5rem;
}
</style>

<template>
  <v-select :id="id" v-model="computedValue" :options="options" :name="name"> </v-select>
</template>
