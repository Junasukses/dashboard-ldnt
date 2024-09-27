<template>
  <div class="flex flex-col place-items-center justify-center w-full px-0 rounded relative">
    <input
      :id="idInput"
      :value="valueModelDisplay"
      :name="Math.random() - false"
      autocomplete="new-password"
      :placeholder="placeholder"
      v-bind="bind"
      readonly
      class="max-h-8 w-full bg-white py-2.5 rounded input-target outline-none md:!text-sm transition-all duration-300 pr-9.5 border border-gray-700"
      :class="{
        '!bg-gray-100': bind.readonly,
        'pr-12': check && !params,
        'pl-10': Boolean(faIcon),
        'pl-2': !Boolean(faIcon),
        '!border-red-500': errorText
      }"
      @focus="isFocus = true"
      @blur="isFocus = false"
      @input="onInput"
      @keydown.enter="onEnter"
      @keydown.esc="onEscape"
    />
    <icon
      v-if="isRequesting"
      fa="sync"
      size="md absolute animated !animate-spin !animate-duration-800 left-3 fa-fw text-green-500"
    />
    <!-- <BaseIcon
      v-else-if="faIcon"
      :path="faIcon"
      w="w-10"
      h="h-10"
      class="absolute top-0 left-0 z-10 pointer-events-none text-gray-500 dark:text-slate-400"
      :class="
        (isFocus ? '!text-blue-500' : 'text-gray-600') +
        (isFocus ? ' animated animate-head-shake ' : '')
      "
    /> -->
    <icon
      v-else-if="faIcon"
      :fa="faIcon"
      size="xs"
      :class="
        'absolute left-3 fa-fw ' +
        (isFocus ? '!text-blue-500' : 'text-gray-600') +
        (isFocus ? ' animated animate-head-shake ' : '')
      "
    />

    <icon
      v-if="errorText"
      :title="errorText"
      fa="exclamation-circle"
      class="absolute right-2 fa-sm fa-fw text-red-400"
    />
    <icon v-else-if="check && !params" fa="check" class="absolute right-2 text-green-400" />

    <icon
      v-show="valueModel"
      :class="{
        'right-5': errorText,
        'right-2': !errorText
      }"
      :title="prop.accept.toLowerCase().includes('image') ? 'Open Image' : 'Download File'"
      :fa="prop.accept.toLowerCase().includes('image') ? 'eye' : 'download'"
      class="absolute transition-all duration-100 fa-fw text-gray-500 text-shadow-md hover:text-blue-600 cursor-pointer"
      @click="onDownloadClicked"
    />
    <icon
      v-show="!valueModel"
      :class="{
        'right-5': errorText,
        'right-2': !errorText
      }"
      title="Open File"
      fa="folder"
      class="absolute transition-all duration-100 fa-fw text-yellow-500 text-shadow-md hover:text-yellow-600 cursor-pointer"
      @click="onOpenClicked"
    />
    <icon
      v-show="valueModel && !bind.readonly"
      :class="{
        '!right-9': errorText,
        'right-7': !errorText
      }"
      title="Clear Selected"
      fa="times"
      size="sm"
      class="absolute transition-all duration-100 fa-fw text-gray-500 hover:text-red-600 cursor-pointer"
      @click="onClear"
    />

    <div
      v-show="isFocus"
      v-if="hints && hints.length > 0"
      class="absolute z-5 top-9/10 w-full -left-4 px-4 animated animate-zoom-in animate-duration-100"
    >
      <ul class="bg-white border p-1 shadow-md">
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

    <!-- <label
      v-show="(label && valueModel) || labeled"
      class="text-xs z-4 font-semibold animated animate-zoom-in animate-duration-100 absolute bottom-full -left-3 text-gray-600"
      :for="placeholder || label"
      :class="{
        'text-blue-600': isFocus
      }"
      >{{ label === 'placeholder' ? placeholder : label }}
      <Popper v-if="info" hover arrow placement="right" class="popper-field" :content="info">
        <icon fa="info-circle" class="fa-md ml-1 fa-fw text-gray-200 hover:text-gray-600" />
      </Popper>
      <slot name="label"></slot>
    </label> -->
    <input v-show="false" ref="inputElement" type="file" :accept="accept" @change="onChangeFile" />
    <vue-final-modal v-model="isOpenPopup" attach="#app">
      <div
        ref="popupElement"
        v-if="isOpenPopup"
        class="fixed popup_file z-40 top-0 left-0 w-screen h-screen !m-0 flex items-center justify-center animated animate-fade-in animate-duration-75"
      >
        <div
          class="absolute z-41 top-0 left-0 bg-dark-50 w-full h-full bg-opacity-50"
          @click.self="isOpenPopup = !isOpenPopup"
        />
        <div class="z-42 py-3 px-3 bg-white w-2/4 h-3/4 rounded flex items-center justify-center">
          <img :src="imgSrc || valueModel" alt="Preview Image" class="max-w-full max-h-full" />
        </div>
      </div>
    </vue-final-modal>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, nextTick, inject } from 'vue'
import { useStore } from '@/stores/app'
import FormControlIcon from '../FormControlIcon.vue'
import BaseIcon from '../BaseIcon.vue'

const store = useStore()
const inputElement = ref()
const params = ref(null)
const isFocus = ref(false)
const valueModel = ref(null)
const size = ref(0)
const errorTextInternal = ref('')
const isOpenPopup = ref(false)
const isRequesting = ref(false)
const imgSrc = ref(null)
const popupElement = ref(null)
const clicked = ref(null)
const download = inject('download')

function onEscape() {
  isOpenPopup.value = false
}

const emit = defineEmits(['input', 'error', 'uploaded'])

function onDownloadClicked() {
  let url = prop.value
  const isImage = prop.accept.toLowerCase().includes('image')
  if (isImage) {
    isOpenPopup.value = true
    return
  } else if (prop.getDownloadUrl) {
    url = prop.getDownloadUrl(valueModel.value)
  }

  window.open(url, '_blank')
}

async function onOpenClicked() {
  if (clicked.value) return
  clicked.value = true
  await inputElement.value.click()
  clicked.value = false
}

function onChangeFile(e) {
  if (e.target.files.length === 0) {
    if (prop.autofocus) {
      onClear()
    }
    return
  }
  size.value = parseFloat((e.target.files[0].size / 1000 / 1000).toFixed(2)) // MB
  if (size.value > prop.maxSize) {
    // swal.fire({
    //   icon: 'error',
    //   text: `File tidak boleh melebihi ${prop.maxSize} MB`
    // })
    // return
  }
  if (prop.directUpload) {
    doUpload(e.target.files[0])
  }
}

function onEnter() {
  inputElement.value.click()
}
function onInput(e) {
  if (e && e.target) {
    valueModel.value = e.target.value
  }
}

function onClear() {
  valueModel.value = null
  imgSrc.value = null
  emit('input', null)
}

const prop = defineProps({
  params: {
    type: Object,
    default() {
      return null
    }
  },
  autofocus: {
    type: Boolean,
    default() {
      return false
    }
  },
  maxSize: {
    type: Number,
    default: 2 //  MB
  },
  directUpload: {
    type: Boolean,
    default: true
  },
  accept: {
    type: String,
    default: 'image/x-png, image/jpeg'
  },
  reducerDisplay: {
    type: Function,
    // eslint-disable-next-line object-shorthand
    default: function (val) {
      return val
    }
  },
  api: {
    type: Object,
    default() {
      return null
    }
  },
  getDownloadUrl: {
    type: Function,
    // eslint-disable-next-line object-shorthand
    default: function (value) {
      return value
    }
  },
  bind: {
    type: Object,
    default() {
      return {}
    }
  },
  faIcon: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  errorText: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: null
  },
  label: {
    type: String,
    default: 'placeholder'
  },
  check: {
    type: Boolean,
    default: true
  },
  labeled: {
    type: Boolean,
    default: false
  },
  classes: {
    type: String,
    default: ''
  },
  info: {
    type: String,
    default: ''
  },
  hints: {
    type: Array,
    default() {
      return []
    }
  }
})

function getValue() {
  return valueModel.value
}

const valueModelDisplay = computed(() => {
  if (!valueModel.value) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    valueModel.value = prop.value
  }
  return prop.reducerDisplay(prop.value)
})

defineExpose({
  getValue,
  valueModelDisplay
})

function onPaste(evt) {
  if (!isFocus.value) return
  const dT = evt.clipboardData || window.clipboardData
  const file = dT.files[0]
  if (!file) {
    return
  }
  size.value = parseFloat((file.size / 1000 / 1000).toFixed(2)) // MB
  if (size.value > prop.maxSize) {
    swal.fire({
      icon: 'error',
      text: `File tidak boleh melebihi ${prop.maxSize} MB`
    })
    return
  }
  if (prop.directUpload) {
    doUpload(file)
  }
}

onMounted(() => {
  params.value = prop.params
  if (params.value) {
    nextTick(() => {
      valueModel.value = params.value.value
    })
  } else {
    if (prop.autofocus) {
      onOpenClicked()
    }
  }

  document.addEventListener('paste', onPaste)
})

// eslint-disable-next-line no-unused-vars
function doProgress(progress) {
  // console.log(progress)
}

function doUpload(file) {
  const request = new XMLHttpRequest()
  const api = prop.api
  if (!api) return
  const url = api?.url
  const apiParams = { ...api.params } || {}
  const apiHeaders = { ...api.headers } || {}

  request.open('POST', url)
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      let responseText = request.responseText
      if (request.status === 200 || request.status === 201) {
        try {
          valueModel.value = file.name
          emit('input', file.name)
          imgSrc.value = URL.createObjectURL(file)
          responseText = JSON.parse(responseText)
          self.internalValue = responseText
        } catch (e) {
          //
        }

        emit('uploaded', responseText)
      } else {
        valueModel.value = null
        imgSrc.value = null
        try {
          responseText = JSON.parse(responseText)
          errorTextInternal.value = responseText.message
        } catch (e) {
          errorTextInternal.value = responseText
        }
        emit('error', responseText)
      }
      if (params.value) {
        params.value.stopEditing()
      }
      isRequesting.value = false
    }
  }

  for (const key in apiHeaders) {
    request.setRequestHeader(key, apiHeaders[key])
  }
  request.upload.addEventListener('progress', doProgress)

  const formData = new FormData()
  formData.append('file', file)

  for (const key in apiParams) {
    formData.append(key, apiParams[key])
  }

  isRequesting.value = true
  request.send(formData)
}

const idInput = computed(() => {
  return prop.placeholder || Math.random() - false
})
</script>
