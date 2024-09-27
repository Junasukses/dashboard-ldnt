<template>
  <div
    class="flex flex-col place-items-center justify-center w-full px-0 rounded relative"
    :class="classes + (label && !params ? ' mt-6 <md:mt-7' : '')"
  >
    <v-select
      :loading="isRequesting"
      :inputId="idInput"
      ref="input"
      autocomplete="new-password"
      v-bind="params?.bind || bind"
      :reduce="reducer"
      :label="'text'"
      :options="internalOptions"
      v-model="valueModel"
      :name="Math.random() - false"
      :placeholder="placeholder"
      class="focus-within:!border-blue-500 bg-white shadow-sm input-target"
      :class="{
        'no-icon': !Boolean(faIcon),
        '!rounded': !topSearch,
        'top-search': topSearch,
        '!text-black': searchText || value,
        '!text-gray-400': !(searchText || value) && !isFocus,
        'border-black': !errorText,
        inline: params,
        multiple: bind.multiple,
        'multiple-empty': (bind.multiple && !valueModel) || (valueModel && valueModel.length === 0),
        '!border-red-600': errorText,
        'fixed top-0 left-0 bg-white z-30 animated animate-slide-in-up animate-duration-100 px-2 shadow-md focus-mobile':
          isFocus && store.isMobile && topSearch
      }"
      :append-to-body="bind.appendToBody !== undefined ? bind.appendToBody : !placeholder"
      @option:deselected="onInputDeselected"
      @option:selected="onInputSelected"
      @update:valueModel="onInputSelected"
      @search="onSearch"
      @close="onClose()"
      @open="onOpen"
      @search:focus="load({ search: '' })"
      @search:blur="(isFocus = false), $emit('clear')"
    >
      <template
        v-if="(isRequesting || (awaitingSearch && !isClosed)) && !bind.multiple"
        v-slot:selected-option
      >
        <div style="display: flex; align-items: baseline">
          <em style="margin-left: 0.5rem">loading...</em>
        </div>
      </template>
      <template #list-footer v-if="createLink">
        <a
          :href="createLink"
          target="_blank"
          class="flex justify-start items-center cursor-pointer text-gray-400 hover:text-gray-800 group pl-5 py-1.5 text-xs transition-all duration-400"
        >
          Add Data
          <icon
            fa="arrow-right"
            size="sm ml-0 ml-0 text-gray-400 group-hover:ml-2 hover:text-blue-600 transition-all duration-400"
          />
        </a>
      </template>
    </v-select>
    <icon
      v-if="
        faIcon &&
        (!bind.multiple ||
          (bind.multiple && !valueModel) ||
          (valueModel && valueModel.length === 0))
      "
      :fa="faIcon"
      :class="
        'absolute -left-1 fa-fw z-8 ' +
        (isFocus ? '!text-blue-500' : 'text-gray-600') +
        (isFocus ? ' animated animate-head-shake ' : '')
      "
    />

    <iconSearch
      class="w-5 h-5 fixed top-3 z-31 left-1 fill-gray-700 stroke-gray-700 animated animate-delay-100 animate-zoom-in animate-duration-100"
      v-if="isFocus && store.isMobile && topSearch"
    />
    <iconTimes
      class="w-5 h-5 fixed top-3 z-1000 right-3 fill-gray-700 animated animate-delay-100 animate-zoom-in animate-duration-100 rounded-full"
      v-if="isFocus && store.isMobile && topSearch"
      @search:blur="(isFocus = false), $emit('clear')"
    />

    <icon
      v-if="errorText"
      :title="errorText"
      fa="exclamation-circle"
      class="absolute right-2 fa-sm fa-fw text-red-400 z-8"
    />
    <icon v-else-if="check && !params" fa="check" class="absolute right-2 text-green-400" />

    <div
      v-show="isFocus"
      v-if="hints.length > 0"
      class="absolute z-5 bottom-9/10 w-full -left-4 px-4 animated animate-zoom-in animate-duration-100"
    >
      <ul class="bg-white border border-yellow-500-full p-1.5 shadow-sm">
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
  </div>
</template>
<script>
import vSelect from 'vue-select'
import { ref, onMounted } from 'vue'
import 'vue-select/dist/vue-select.css'
import { useStore } from '@/stores/app'

export default {
  emits: [
    'input',
    'update:value',
    'update:errorText',
    'update:valueFull',
    'selected',
    'deselected',
    'change',
    'clear'
  ],
  components: {
    vSelect
  },
  computed: {
    idInput() {
      return this.placeholder || Math.random() - false
    }
  },
  props: {
    params: {
      type: Object,
      default() {
        return null
      }
    },
    api: {
      type: Object,
      default: () => null
    },
    bind: {
      type: Object,
      default() {
        return {}
      }
    },
    classes: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    faIcon: {
      type: String,
      default: ''
    },
    check: {
      type: Boolean,
      default: true
    },
    labeled: {
      type: Boolean,
      default: false
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
      type: [String, Number, Array],
      default: null
    },
    valueField: {
      type: String,
      default: 'id'
    },
    autofocus: {
      type: Boolean,
      default() {
        return false
      }
    },
    topSearch: {
      type: Boolean,
      default() {
        return false
      }
    },
    displayField: {
      type: String,
      default: 'name'
    },
    label: {
      type: [String],
      default: 'placeholder'
    },
    hints: {
      type: Array,
      default() {
        return []
      }
    },
    createLink: {
      type: String,
      default: ''
    }
  },
  setup(prop) {
    const searchText = ref('')
    const fetchController = ref(null)
    const valueModel = ref(null)
    const oldValue = ref(null)
    const oldValueObj = ref(null)
    const currentPage = ref(1)
    const hasNext = ref(true)
    const isFocus = ref(false)
    const internalOptions = ref([])
    const awaitingSearch = ref(false)
    const isClosed = ref(false)
    const cachedOptions = ref([])
    const store = useStore()

    function reducer(val) {
      const data = val && typeof val === 'object' ? val['id'] : val
      return data
    }

    function cacheOptions(rows) {
      const ids = cachedOptions.value.map((dt) => dt[prop.valueField])
      rows.forEach((dt) => {
        if (!ids.includes(dt[prop.valueField])) {
          cachedOptions.value.push(dt)
        }
      })
    }

    function mapData(val) {
      const id = typeof val === 'object' && val !== null ? val[prop.valueField] : val
      const text =
        typeof val === 'object' && val !== null
          ? val[prop.params?.displayField || prop.displayField]
          : val
      if (typeof val === 'object') {
        const newObj = { ...val }
        Object.assign(newObj, { id, text })
        return newObj
      } else {
        return { id, text }
      }
    }

    function onOpen() {
      if (!(prop.api || prop.params?.colDef.cellEditorParams.api)) {
        return
      }
      if (oldValueObj.value && oldValueObj.value) {
        internalOptions.value = [oldValueObj.value]
      } else {
        internalOptions.value = []
      }
      isClosed.value = false
    }

    function onClose() {
      isClosed.value = true
      if (
        oldValueObj.value &&
        !internalOptions.value.find((dt) => dt[prop.valueField] === valueModel.value)
      ) {
        internalOptions.value.push(oldValueObj.value)
      }
    }

    // handling on search
    function onSearch(search, loading) {
      if (
        !(prop.api || prop.params?.colDef.cellEditorParams.api) ||
        (valueModel.value && oldValue.value !== valueModel.value)
      ) {
        oldValue.value = valueModel.value
        return
      }
      searchText.value = search || ''
      if (!awaitingSearch.value) {
        setTimeout(() => {
          try {
            fetchController.value.abort()
          } catch (e) {
            //
          }
          if (isClosed.value) {
            awaitingSearch.value = false
            // loading(false)
            return
          }
          loading(true)
          // eslint-disable-next-line no-unused-vars
          load({}, function (dt) {
            loading(false)
          })
          awaitingSearch.value = false
        }, 500) // 1 sec delay
      }
      internalOptions.value = []
      awaitingSearch.value = true
    }

    const isRequesting = ref(false)
    const pageLength = ref(25)
    const chosenScope = ref(null)

    async function loadById(id, callback = function () {}) {
      const api = prop.api || prop.params?.colDef.cellEditorParams.api
      api.headers = api.headers || {}
      api.headers.CLIENT_PURPOSE = 'integration'
      const url = api.url + '/' + id
      const apiParams = { ...api.params } || {}

      fetchController.value = new AbortController()
      const signal = fetchController.value.signal
      let rows = []
      //  proses request FECTH
      try {
        isRequesting.value = true
        const result = await fetch(url + '?' + new URLSearchParams(apiParams), {
          headers: api.headers,
          cache: api.cacheById || api.cache || (prop.bind.disabled ? 'force-cache' : 'reload'),
          signal
        })

        // jika berhasil
        if (result.ok) {
          let responseJson = await result.json()
          const successFunction = api.onsuccess
          if (typeof successFunction === 'function') {
            responseJson = successFunction(responseJson, id)
            hasNext.value = false
          } else {
            hasNext.value = false
          }

          // property data sebagai array response
          rows = [responseJson.data].map((dt) => mapData(dt))
          oldValueObj.value = rows[0]
        } else {
          throw new Error('Failed when trying to connect to server')
        }
      } catch (err) {
        const failedFunction = api.onerror
        if (typeof failedFunction === 'function') {
          failedFunction(err)
        }
      }
      isRequesting.value = false
      internalOptions.value = rows
      callback(rows)
    }

    async function load(paramObj = {}, callback = function () {}) {
      isFocus.value = true
      const api = prop.api || prop.params?.colDef.cellEditorParams.api
      if (!api) {
        return
      }
      api.headers = api.headers || {}
      api.headers.CLIENT_PURPOSE = 'integration'
      const apiParams = { ...api.params } || {}
      Object.assign(apiParams, paramObj)

      const currentPageTemp = currentPage.value
      currentPage.value = null

      // searching
      if (apiParams.search === undefined) {
        Object.assign(apiParams, {
          search: searchText.value
        })
      }

      // column searchfield
      if (apiParams.searchfield === undefined) {
        Object.assign(apiParams, {
          searchfield: prop.params?.displayField || prop.displayField
        })
      }

      // column selectfield
      if (apiParams.selectfield === undefined) {
        Object.assign(apiParams, {
          selectfield: `${prop.params?.displayField || prop.displayField}${
            prop.valueField !== (prop.params?.displayField || prop.displayField)
              ? ',' + prop.valueField
              : ''
          }`
        })
      }

      // paginate / page-length
      if (!apiParams.paginate && pageLength.value) {
        Object.assign(apiParams, {
          paginate: pageLength.value
        })
      }

      // scopes
      if (!apiParams.scope && chosenScope.value) {
        Object.assign(apiParams, {
          scopes: chosenScope.value
        })
      }

      // penyusunan param GET
      const paramStr = new URLSearchParams(apiParams)
      const url = api.url + '?' + paramStr

      let rows = []
      let signal

      //  buat controller
      try {
        fetchController.value = new AbortController()
        signal = fetchController.value.signal
      } catch (e) {
        //
      }

      //  proses request FECTH
      try {
        isRequesting.value = true
        const result = await fetch(url, {
          mode: 'cors',
          cache: api.cache || 'no-cache',
          credentials: 'same-origin',
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          headers: api.headers,
          signal
        })

        // jika berhasil
        if (result.ok) {
          let responseJson = await result.json()
          const successFunction = api.onsuccess
          if (successFunction) {
            responseJson = successFunction(responseJson)
            currentPage.value = responseJson.page
            hasNext.value = responseJson.hasNext
          } else {
            hasNext.value = false
          }

          // property data sebagai array response
          rows = responseJson.data.map((dt) => mapData(dt))
        } else {
          throw new Error('Failed when trying to connect to server')
        }
      } catch (err) {
        currentPage.value = currentPageTemp
        const failedFunction = api.onerror
        if (typeof failedFunction === 'function') {
          failedFunction(err)
        }
      }
      isRequesting.value = false
      if (oldValueObj.value && !rows.find((dt) => dt[prop.valueField] === valueModel.value)) {
        rows.push(oldValueObj.value)
      }
      internalOptions.value = rows
      if (prop.bind.multiple) {
        cacheOptions(rows)
      }
      callback(rows)
    }

    onMounted(() => {
      if (prop.api || prop.params?.colDef.cellEditorParams.api) {
        return
      }
      internalOptions.value = (prop.params?.options || prop.options).map((dt) => mapData(dt))
    })

    return {
      store,
      cachedOptions,
      loadById,
      isClosed,
      onOpen,
      onClose,
      awaitingSearch,
      valueModel,
      oldValueObj,
      reducer,
      load,
      searchText,
      isRequesting,
      pageLength,
      chosenScope,
      onSearch,
      internalOptions,
      isFocus,
      mapData
    }
  },
  watch: {
    options(v) {
      this.internalOptions = (this.params?.options || v).map((dt) => this.mapData(dt))
    },
    valueModel(v) {
      this.$emit('input', v)
      this.$emit('update:value', v)
      this.$emit('update:errorText', '')
    },
    value(v) {
      if (!v) {
        this.oldValue = null
        this.oldValueObj = null
      }
      if (this.valueModel !== v) {
        this.valueModel = v
        if (v && this.api && !isNaN(v - 1)) {
          this.valueModel = parseInt(v)
          this.loadById(this.valueModel)
        }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      if (this.params) {
        this.$emit('input', this.params.value)
        this.valueModel = this.params.value
      } else if (this.value && this.api && !isNaN(this.value - 1)) {
        this.valueModel = parseInt(this.value)
        this.loadById(this.valueModel)
      } else {
        this.valueModel = this.value
        if (this.bind.multiple) {
          this.internalOptions = [...this.options]
        }
      }
    })
  },
  mounted() {
    if (this.params) {
      this.$nextTick(() => {
        this.$refs.input.onSearchFocus()
        this.$refs.input.$el.getElementsByTagName('input')[0].focus()
      })
    } else {
      if (this.autofocus) {
        const self = this
        setTimeout(() => {
          const inputEls = self.$refs.input?.$el.getElementsByTagName('input')
          if (inputEls && inputEls.length > 0) {
            inputEls[0].focus()
          }
        }, 350)
      }
    }
  },
  methods: {
    getValue() {
      return this.valueModel
    },
    onInputDeselected(val) {
      this.$emit('update:valueFull', this.valueModel)
      if (this.params && typeof this.params.input === 'function') {
        this.params.input(this.valueModel, this.params)
      }
      this.$emit('deselected', val)
    },
    onInputSelected(val) {
      this.$emit('update:valueFull', val)
      if (this.params && typeof this.params.input === 'function') {
        this.params.input(val, this.params)
      }
      val = this.bind.multiple
        ? val.map((dt) => {
            return typeof dt !== 'object' ? dt : dt.id
          })
        : val['id']
      this.awaitingSearch = false
      if (this.bind.multiple && this.autofocus) {
        setTimeout(() => this.$refs.input.$el.getElementsByTagName('input')[0].focus(), 350)
      }
      // eslint-disable-next-line eqeqeq
      if (val) {
        const foundOldValueObj = this.internalOptions.find((dt) => dt[this.valueField] === val)
        if (foundOldValueObj) {
          this.oldValueObj = foundOldValueObj
        }
        this.oldValueObj = foundOldValueObj
      }
      this.oldValue = this.valueModel
      this.valueModel = val

      this.$emit('selected', val[val.length - 1])
    }
  }
}
</script>
<style>
/* Applying Tailwind CSS classes */
.vs__actions {
  @apply bg-transparent;
}

.vs__clear > svg {
  @apply fill-gray-500 hover:fill-red-600;
}

.vs__clear {
  zoom: 85% !important;
}

.vs__search {
  @apply min-w-full cursor-pointer md:!text-xs text-sm h-full !py-1 md:max-h-8 !px-9 !border-none !outline-none transition-all duration-300;
}

.v-select.multiple-empty .vs__search {
  @apply !ml-7;
}

.v-select.inline .vs__search {
  @apply !px-2.5;
}

.no-icon .vs__selected {
  @apply !left-1;
}

.no-icon .vs__search {
  @apply !pl-2;
}

.v-select.multiple .vs__selected {
  @apply !static !max-h-[20px];
}

.v-select.multiple .vs__actions {
  @apply !hidden;
}

.v-select.multiple .vs__search {
  @apply !min-w-[2px] px-1 !py-1 bg-none !max-h-[20px];
}

.v-select.multiple-empty .vs__search {
  @apply text-gray-400 animate-none;
}

.v-select {
  @apply w-full border transition-all rounded duration-100;
}

.vs__dropdown-option {
  @apply md:!text-xs;
}

.vs2__combobox {
  @apply border;
}

.vs__dropdown-toggle {
  @apply border-none;
}

.vs__selected {
  @apply absolute left-8 top-0.5 z-10 md:!text-xs text-gray-700;
}

.vs__open-indicator {
  @apply !opacity-0;
}

.vs__actions {
  /* @apply  !bg-white; */
}

.vs__selected-options {
  @apply rounded-full;
}

.focus-mobile .vs__dropdown-menu {
  @apply !h-[90vh] !max-h-[90vh];
}

.focus-mobile .vs__search {
  @apply !text-gray-400;
}

.vs__dropdown-menu::-webkit-scrollbar {
  width: 6.5px !important;
  height: 6.5px !important;
}

.vs__dropdown-menu::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

.vs__dropdown-menu::-webkit-scrollbar-thumb {
  @apply bg-gray-400 cursor-pointer bg-opacity-25;
}

.vs__dropdown-menu::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 cursor-pointer;
  background-color: rgba(107, 114, 128, 0.45);
}

.vs__spinner {
  zoom: 80% !important;
  border-top: none !important;
}
</style>
