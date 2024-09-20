<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useMainStore } from '@/stores/main'
import axios from 'axios'
import 'vue-select/dist/vue-select.css'

const token = ref(localStorage.getItem('authToken') ?? '')
const env = ref(import.meta.env.VITE_API_URL)

const mainStore = useMainStore()

const selectEl = ref(null)
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

const emit = defineEmits(['update:modelValue', 'setRef'])

watch(
  () => props.params,
  () => {
    fetchData()
  }
)

async function fetchData() {
  try {
    let tempParams = {}
    if (props.params) {
      tempParams = props.params
    }
    const fixedParams = new URLSearchParams(props.params)
    let res = await axios.get(env.value + '/' + props.api + '?' + fixedParams, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    props.options = res.data.data
  } catch (error) {
    console.log(error)
  }
}

const computedValue = computed({
  get: () => {
    // Jika valueKey di-set, ambil modelValue berdasarkan valueKey (untuk array object)
    return props.options.find(
      (option) => (props.valueKey ? option[props.valueKey] : option) === props.modelValue
    )
  },
  set: (value) => {
    // Emit berdasarkan valueKey (jika array object) atau nilai langsung (jika array primitif)
    emit('update:modelValue', props.valueKey ? value[props.valueKey] : value)
  }
})

const processedOptions = computed(() => {
  return props.options.map((option) => {
    // Jika array object, gunakan displayKey untuk menampilkan label dan valueKey untuk nilai
    if (typeof option === 'object') {
      return {
        label: option[props.displayKey],
        value: option[props.valueKey]
      }
    }
    // Jika array primitif, gunakan nilai langsung sebagai label dan value
    else {
      return {
        label: option,
        value: option
      }
    }
  })
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
    if (!mainStore.isFieldFocusRegistered) {
      window.addEventListener('keydown', fieldFocusHook)
      mainStore.isFieldFocusRegistered = true
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
  <v-select
    :id="id"
    :label="displayKey"
    v-model="computedValue"
    :options="processedOptions"
    :name="name"
    :disabled="disabled"
    :clearable="isClear"
    :placeholder="placeholder"
  >
  </v-select>
</template>
