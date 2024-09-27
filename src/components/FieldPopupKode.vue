<template>
  <div class="flex flex-col place-items-center justify-center w-full px-0 rounded relative">
    <input
      :id="idInput"
      ref="inputElement"
      :value="valueModel"
      :name="Math.random() - false"
      autocomplete="new-password"
      :placeholder="placeholder"
      v-bind="bind"
      :readonly="bind.readonly || params"
      class="max-h-8 w-full bg-white py-2.5 rounded input-target outline-none md:!text-sm transition-all duration-300 pr-9.5 border border-gray-700"
      :class="{
        '!bg-gray-100': bind.readonly,
        'pr-10': check && !params,
        'pl-10': Boolean(faIcon),
        'pl-2.2': !Boolean(faIcon)
      }"
      @focus="isFocus = true"
      @blur="isFocus = false"
      @input="onInput"
      @keydown.enter="onEnter"
    />
    <icon
      v-if="faIcon"
      :fa="faIcon"
      :class="`absolute -left-1 fa-fw ${
        isFocus ? '!text-blue-500 animated animate-head-shake' : 'text-gray-600'
      }`"
    />
    <icon v-else-if="check && !params" fa="check" class="absolute right-2 text-green-400" />
    <icon
      v-show="false"
      :class="{
        'right-5.5': errorText || (!valueModelId && valueModel),
        'right-2': !errorText
      }"
      title="Buka Pilihan"
      fa="search"
      class="absolute transition-all duration-100 fa-fw text-gray-500 hover:text-blue-600 cursor-pointer"
      @click="isOpenPopup = true"
    />
    <icon
      v-show="valueModel && !bind.readonly"
      :class="{
        '!right-3': errorText || (!valueModelId && valueModel),
        'right-7': !errorText
      }"
      title="Clear Selected"
      fa="times"
      size="sm"
      class="absolute transition-all duration-100 fa-fw text-gray-500 hover:text-red-600 cursor-pointer"
      @click="onClear"
    />
    <div
      v-show="isFocus && hints.length > 0"
      class="absolute z-5 top-9/10 w-full -left-4 px-4 animated animate-zoom-in animate-duration-100"
    >
      <ul class="bg-white border border-yellow-500 rounded p-1.5 shadow-sm">
        <li
          v-for="hint in hints"
          :key="'hint-' + hint"
          class="flex flex-row px-2 gap-3 place-items-center"
        >
          <icon
            :class="errorText ? '!text-red-400' : '!text-yellow-500'"
            :fa="errorText ? 'exclamation' : 'info'"
            style="zoom: 90%"
          />
          <span class="text-gray-500 text-xs">{{ hint }}</span>
        </li>
      </ul>
    </div>
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
const token = ref(localStorage.getItem('authToken') ?? import.meta.env.VITE_AUTH_TOKEN)

function onEscape() {
  if (!params.value) {
    isOpenPopup.value = false
  }
}

const emit = defineEmits(['input', 'update:valueFull'])

function onRowClicked(val) {
  isOpenPopup.value = false
  chosen.value = val
  valueModel.value = val[prop.displayField]
  valueModelId.value = val[prop.valueField]
  emit('input', valueModelId.value)
  emit('update:valueFull', val)

  if (params.value && typeof params.value.input === 'function') {
    params.value?.input(val, params.value)
  }
}

async function onEnter() {
  if (params.value) return

  const data = await fetch(
    `${baseUrl.value}/operation/v_item_catalog/get_by_barcode?barcode=${valueModel.value}`,
    {
      headers: { 'Content-Type': 'Application/json', authorization: `Bearer ${token.value}` }
    }
  ).then((res) => res.json())

  if (data.code === 200) {
    valueModel.value = data.data[prop.displayField]
    valueModelFull.value = data.data
    valueModelId.value = data.data.id
    emit('update:valueFull', data.data)
  } else {
    isOpenPopup.value = true
  }
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
  valueModel.value = null
  valueModelId.value = null
  valueModelFull.value = null
}

const prop = defineProps({
  api: { type: Object, default: () => ({}) },
  params: { type: Object, default: null },
  columns: { type: Array, default: () => [] },
  bind: { type: Object, default: () => ({}) },
  faIcon: { type: String, default: '' },
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
  onEnter,
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
