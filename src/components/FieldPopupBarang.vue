<template>
  <div>
    <button class="focus:( !outline-none) !text-xs rounded w-auto" @click="onClick">
      <slot />
    </button>

    <vue-final-modal v-model="isOpenPopup" attach="#app" :drag="true" :resize="true">
      <div
        v-if="isOpenPopup"
        class="top-0 left-0 w-screen h-screen !m-0 flex items-center justify-center animated animate-fade-in animate-duration-75"
      >
        <div
          class="absolute z-41 top-0 left-0 bg-dark-50 w-full h-full bg-opacity-50"
          @click.self="isOpenPopup = !isOpenPopup"
        />
        <div class="z-42 py-3 px-3 <md:px-0 bg-white w-3/4 <md:w-full h-3/4 rounded relative">
          <slot name="header"></slot>
          <table-api
            v-bind="prop"
            :selectable="true"
            :is-popup="true"
            :search-init="valueModel"
            custom-class="!h-full"
            @escape="onEscape"
            @rowClick="onRowClicked"
          />
        </div>
      </div>
    </vue-final-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch, computed } from 'vue'
import TableApi from '../components/forms/TableApi.vue'
import Popper from 'vue3-popper'

const inputElement = ref(null)
const params = ref(null)
const isFocus = ref(false)
const valueModel = ref(null)
const valueModelId = ref(null)
const valueModelFull = ref(null)
const isOpenPopup = ref(false)
const chosen = reactive({})
const baseUrl = ref(import.meta.env.VITE_API_URL)
const token = ref(localStorage.getItem('token') ?? import.meta.env.VITE_AUTH_TOKEN)

function onEscape() {
  if (!params.value) {
    isOpenPopup.value = false
  }
}

const emit = defineEmits(['input', 'update:valueFull'])

function onRowClicked(val) {
  if (prop.clickedRow) {
    isOpenPopup.value = false
  }
  chosen.value = val
  valueModel.value = val[prop.displayField]
  valueModelId.value = val[prop.valueField]
  emit('input', valueModelId.value)
  emit('update:valueFull', val)

  if (params.value && typeof params.value.input === 'function') {
    params.value?.input(val, params.value)
  }
}

function onClick() {
  isOpenPopup.value = true
}

function onInput(e) {
  if (e && e.target) {
    valueModelId.value = null
    valueModel.value = e.target.value
  }
}

function onClear() {
  valueModel.value = null
  valueModelId.value = null
  chosen.value = {}
  emit('input', null)
  emit('update:valueFull', null)
  inputElement.value?.focus()
}

function onReset() {
  delete valueModel.value
  delete valueModelId.value
  delete valueModelFull.value
}

const prop = defineProps({
  api: { type: Object, default: () => ({}) },
  params: { type: Object, default: null },
  columns: { type: Array, default: () => [] },
  bind: { type: Object, default: () => ({}) },
  faIcon: { type: String, default: '' },
  clickedRow: { type: Boolean, default: true },
  placeholder: { type: String, default: '' },
  errorText: { type: String, default: '' },
  value: { type: [String, Number], default: null },
  label: { type: String, default: 'placeholder' },
  valueField: { type: String, default: 'id' },
  displayField: { type: String, default: 'name' },
  autofocus: { type: Boolean, default: false },
  check: { type: Boolean, default: true },
  labeled: { type: Boolean, default: false },
  classes: { type: String, default: '' },
  info: { type: String, default: '' },
  hints: { type: Array, default: () => [] }
})

function getValue() {
  return valueModelId.value
}

function getValues() {
  return valueModelFull.value
}

defineExpose({
  getValue,
  getValues,
  onReset
})

onMounted(() => {
  params.value = prop.params
  nextTick(() => {
    if (params.value) {
      valueModelId.value = params.value.value
    } else {
      valueModelId.value = prop.value
      setTimeout(() => {
        if (!valueModel.value && valueModelId.value) {
          loadById(valueModelId.value, (dt) => {
            chosen.value = dt
            valueModel.value = dt[prop.displayField]
          })
        }
      }, 100)
    }
  })
})

watch(prop, (vProp) => {
  if (vProp && valueModelId.value !== vProp.value) {
    valueModelId.value = vProp.value
    if (valueModelId.value && !isNaN(valueModelId.value - 1)) {
      loadById(valueModelId.value, (dt) => {
        chosen.value = dt
        valueModel.value = dt[params.value ? params.value.displayField : prop.displayField]
      })
    } else {
      valueModel.value = null
    }
  }
})

async function loadById(id, callback = () => {}) {
  const api = prop.api
  api.headers.CLIENT_PURPOSE = 'integration'
  const url = `${api.url}/${id}`
  const apiParams = { ...api.params } || {}

  try {
    const result = await fetch(`${url}?${new URLSearchParams(apiParams)}`, {
      headers: api.headers,
      cache: api.cacheById || api.cache || (prop.bind.readonly ? 'force-cache' : 'reload')
    })

    if (result.ok) {
      let responseJson = await result.json()
      const successFunction = api.onsuccess
      if (typeof successFunction === 'function') {
        responseJson = successFunction(responseJson, id)
      }
      callback(responseJson.data)
    } else {
      throw new Error('Failed to connect to server')
    }
  } catch (err) {
    const failedFunction = api.onerror
    if (typeof failedFunction === 'function') {
      failedFunction(err)
    }
  }
}

const idInput = computed(() => prop.placeholder || Math.random() - false)
</script>
