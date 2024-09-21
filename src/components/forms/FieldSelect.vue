<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useMainStore } from '@/stores/main'
import axios from 'axios'
import 'vue-select/dist/vue-select.css'

// Token dan URL API diambil dari localStorage atau env
const token = ref(
  localStorage.getItem('authToken') ??
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMzRmOTJiN2Y5ZWQ2NTljMjRkYzY1ODAyODg4OWUxNTk5ZDZiY2M2ZmM3YjJjN2VlMmU0YWI3YWVlYTdiMTU3MWY1ZDRmYjM4OGUyNjZlZjAiLCJpYXQiOjE3MjY4ODAzMTAuMzc2MjQ3LCJuYmYiOjE3MjY4ODAzMTAuMzc2MjUxLCJleHAiOjE3NTg0MTYzMTAuMzcwNDY5LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.rQ13lQsgWyehnxe0UMphZl3iMGvTo5NVc0DQFQBupbdn0foOu70b-8R7sUyonRrxqa691iv9Xuqd2jpIvCA3YTHJalf-75UbtM4c4mfUm4tpzuMFtUZMjYaSrccvnc45nMmAMFJgmmCd8rVZCID1fFPnLdOHMqii9kluIscOZwC29g-Qsl-4IIUeWTERUWKdFIz8I_wzNMFC7Km_1cNQ-vFHMtuLe-JL5PqR9BwTWKgrDeG41t8S52YXKPZrDDkTeWtDqwSmKkVU7nmDynFbH2lBslMuN_w9rd2kesdSTIg8_RoVvGKxoqJ0dcuVtF3DRli5tKv50qzPzAibCH53hYOqLNhOim7O8v4r-uwLw2betSdJoQn_xXFYsmW2O6sJDRP3Rk-mXzOKPs-uBjsrTNGkdX0y91NqeXKMQ2qUsVprPXMv71Felgz5YsmthUwu0vYQXf62wAbzWJS-U_sR-m0V_PiE5TfTSlmJHcWAzP3BSFye9RjOhOwknV0dkFgD9mTpxhbc-E0PfQW74ZXoFRj_obpbnQXBNLMXumPgHAS5DShI0zp3UKLIKGPFS73bByBjMdAg5hwTzjKa2MsnarkeDt0g8QT6MHES14mcEPz_HXOTfqahU-_5MzhLDczZhYxiVGq9OCoO1sRLBKZfz0I3V0UfwSCnNyuZEn17n8Q'
)
const env = ref(import.meta.env.VITE_API_URL)

const selectEl = ref(null)
const options = ref([])
const currentPage = ref(1)
const hasNextPage = ref(false)
const loadingMore = ref(false)

const props = defineProps({
  api: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: null
  },
  id: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: ''
  },
  params: {
    type: Object,
    default: () => ({})
  },
  valueKey: {
    type: String,
    default: null
  },
  displayKey: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  isClear: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  errorMsg: {
    type: [String, Array],
    default: ''
  },
  required: Boolean,
  borderless: Boolean,
  transparent: Boolean,
  ctrlKFocus: Boolean
})

const emit = defineEmits(['update:modelValue', 'setRef', 'update:valuefull'])

async function fetchData(page = 1) {
  if (loadingMore.value) return // Jika masih loading, jangan fetch lagi

  loadingMore.value = true
  try {
    const params = new URLSearchParams({
      page,
      ...props.params
    })
    const res = await axios.get(`${env.value}/operation/${props.api}?${params}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (page === 1) {
      options.value = res.data.data
    } else {
      options.value = [...options.value, ...res.data.data]
    }

    currentPage.value = res.data.current_page
    hasNextPage.value = res.data.has_next
  } catch (error) {
    console.error(error)
  } finally {
    loadingMore.value = false
  }
}
function handleDropdownScroll(event) {
  const dropdown = event.target
  if (dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight - 10) {
    if (hasNextPage.value && !loadingMore.value) {
      fetchData(currentPage.value + 1) // Fetch next page
    }
  }
}
function handleDropdownOpen() {
  nextTick(() => {
    const dropdown = selectEl.value?.$el?.querySelector('.vs__dropdown-menu')
    if (dropdown) {
      dropdown.addEventListener('scroll', handleDropdownScroll)
    }
  })
}

watch(
  () => props.params,
  () => {
    if (props.api) fetchData()
  },
  { immediate: true }
)

const processedOptions = computed(() => {
  let finalOptions = props.options.length ? props.options : options.value

  return finalOptions.map((option) => {
    if (typeof option === 'object') {
      return {
        [props.displayKey]: option[props.displayKey] || 'Label Not Available',
        [props.valueKey]: option[props.valueKey]
      }
    } else {
      return {
        [props.displayKey]: option,
        [props.valueKey]: option
      }
    }
  })
})

const computedValue = computed({
  get: () => {
    let finalOptions = props.options.length ? props.options : options.value
    return finalOptions.find(
      (option) => (props.valueKey ? option[props.valueKey] : option) === props.modelValue
    )
  },
  set: (value) => {
    emit('update:valuefull', value)
    emit('update:modelValue', props.valueKey ? value[props.valueKey] : value)
  }
})

onMounted(() => {
  if (selectEl.value) {
    emit('setRef', selectEl.value)
  }
  if (props.api) {
    fetchData()
  }
})

if (props.ctrlKFocus) {
  const fieldFocusHook = (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault()
      selectEl.value.focus()
    } else if (e.key === 'Escape') {
      selectEl.value.blur()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', fieldFocusHook)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', fieldFocusHook)
  })
}
</script>

<template>
  <v-select
    :id="id"
    :label="displayKey"
    v-model="computedValue"
    :options="processedOptions"
    :name="name"
    :disabled="disabled"
    :clearable="isClear"
    :placeholder="placeholder"
    @open="handleDropdownOpen"
  >
  </v-select>
</template>

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
