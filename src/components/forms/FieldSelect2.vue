<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import axios from 'axios'
import 'vue-select/dist/vue-select.css'

const selectEl = ref(null)
const options = ref([])

const props = defineProps({
  api: {
    type: Object,
    default: () => ({
      url: null,
      method: 'GET',
      headers: {},
      params: {}
    })
  },
  name: {
    type: String,
    default: null
  },
  id: {
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
  }
})

const emit = defineEmits(['update:modelValue', 'setRef', 'update:valuefull'])

async function fetchData() {
  try {
    const queryParams = new URLSearchParams({
      ...props.api.params // params dari api parent
    })

    const config = {
      method: props.api.method || 'GET',
      url: `${props.api.url}?${queryParams}`,
      headers: {
        ...props.api.headers
      }
    }

    const res = await axios(config)
    options.value = res.data.data
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => props.api,
  (newConfig) => {
    if (newConfig.url) fetchData()
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
  if (props.api.url) {
    fetchData()
  }
})
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
    @search="fetchData"
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
  --vs-search-input-placeholder-color: #6b7280;

  --vs-font-size: 0.875rem;
  --vs-line-height: 1.25rem;
  --vs-border-radius: 0.25rem;
}
</style>
