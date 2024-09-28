<template>
  <div class="flex items-center flex-col w-full h-full bg-white p-2.5 rounded" ref="currentEl">
    <div class="table-header w-full mb-2 flex items-center text-sm relative">
      <!-- HEADER TABLE -->

      <!-- SCOPES -->
      <div
        v-if="prop.scopes.length > 0 && !store.isMobile"
        v-click-outside="clickOutsideScope"
        :class="{
          '!border-blue-400': Boolean(chosenScope)
        }"
        class="page-length-selector px-2 mr-2 border bg-white transition-all duration-300 relative group select-none rounded-sm border min-w-24 py-1 px-2 flex items-center justify-center hover:bg-gray-50 hover:!border-blue-400 hover:shadow-sm cursor-pointer"
        @click="isScopeSelecting = !isScopeSelecting"
      >
        <div
          class="page-length-selector text-sm flex items-center gap-x-1 text-gray-500 hover:!text-black"
        >
          {{ scopes.find((dt) => dt.value === chosenScope)?.name || 'Semua' }}
          <FontAwesomeIcon
            class="fa-fw fa-sm text-gray-500 page-length-selector"
            :icon="['fas', 'chevron-down']"
          />
        </div>

        <ul
          v-show="isScopeSelecting"
          class="absolute !text-sm top-full right-0 z-50 bg-white w-full border rounded-sm shadow-sm"
        >
          <li
            key="page-scope-all"
            class="text-center py-1 hover:bg-gray-100 px-2 py-1"
            @click="setScope(null)"
          >
            Semua
          </li>
          <li
            v-for="scope in scopes"
            :key="'page-scope-' + scope.name"
            class="text-center py-1 hover:bg-gray-100 px-2 py-1"
            @click="setScope(scope.value)"
          >
            {{ scope.name }}
          </li>
        </ul>
      </div>
      <!-- SCOPES END -->
      <div v-show="prop.useDateRange" class="flex items-center gap-x-1 mr-2 max-w-60">
        <!-- date range dri input  -->
      </div>
      <div class="flex items-center relative group text-sm" v-show="!isShowSelectedOnly">
        <input
          ref="search"
          :autofocus="store.isMobile ? '' : 'autofocus'"
          :value="searchText"
          autocomplete="off"
          placeholder="(Ctrl+F)"
          :class="{
            'border-blue-500': searchText
          }"
          class="rounded-sm search-table-api input-target ring-none text-sm bg-light-200 transition-all duration-300 text-gray-700 <md:w-20 md:w-30 focus:w-45 focus:w-35 bg-white focus:border-blue-400 focus:shadow-sm pl-8 pr-2 py-1 outline-none ring-transparent border border-gray-300"
          @keydown.esc="onSearchTextChange(null)"
          @change="onSearchTextChange"
        />
        <div class="absolute h-full top-0 left-0 pl-2 flex items-center">
          <iconSearch
            class="fill-gray-400 text-gray-400 stroke-gray-400 w-4 h-4"
            :class="{
              '!stroke-blue-500': searchText
            }"
          />
        </div>
        <div v-show="searchText" class="absolute h-full top-0 right-0 pr-2 flex items-center">
          <FontAwesomeIcon
            class="fa-fw text-gray-400 cursor-pointer"
            :icon="['fas', 'times']"
            @click="onSearchTextChange(null)"
          />
        </div>
      </div>
      <!-- ACTION ON ROW  -->
      <div v-if="!prop.isPopup && selectedRow" class="ml-2 gap-x-1.5 items-center hidden md:flex">
        <Popper
          v-for="(action, idx) in prop.actions"
          v-show="action.show ? action.show(selectedRow) : true"
          :key="'action-' + idx"
          arrow
          :content="action.title"
          hover
        >
          <button
            class="py-1 px-2 rounded-sm bg-opacity-80 hover:bg-opacity-100 hover:shadow-sm focus: !outline-none transition-all duration-200 animated animate-zoom-in animate-duration-100"
            :class="action.class"
            @click="action.click(selectedRow)"
          >
            {{ action.text || '' }}
            <FontAwesomeIcon v-if="action.icon" class="fa-fw fa-sm" :icon="['fas', action.icon]" />
          </button>
        </Popper>
      </div>
      <div
        v-if="!prop.isPopup && prop.actions.length > 0 && selectedRow"
        class="ml-2 gap-x-1.5 items-center hidden <md:flex"
      >
        <ButtonDropdown icon="" text="Action">
          <li
            v-for="(action, idx) in prop.actions"
            v-show="action.show ? action.show(selectedRow) : true"
            :key="'action-' + idx"
            arrow
            class="py-2 px-2 my-2 flex items-center border-t justify-between rounded-sm bg-opacity-80 hover:bg-opacity-100 hover:shadow-sm focus:!outline-none transition-all duration-200"
            @click="action.click(selectedRow)"
          >
            {{ action.title || '' }}
            <FontAwesomeIcon v-if="action.icon" class="fa-fw fa-sm" :icon="['fas', action.icon]" />
          </li>
        </ButtonDropdown>
      </div>
      <!-- ACTION END -->

      <!-- ACTION NON ROW  -->
      <div class="ml-auto flex gap-x-2 items-center">
        <slot name="header" />
      </div>
      <!-- ACTION END -->

      <div class="ml-2 flex gap-x-1 items-center">
        <div
          title="Refresh"
          class="px-2.5 bg-white py-1 transition-all duration-300 border border-gray-300 rounded-sm hover:shadow-sm hover:!border-blue-500 group cursor-pointer"
          @click="reload(true)"
        >
          <FontAwesomeIcon
            :class="{
              '!animate-spin !animate-duration-800 !text-blue-400': isRequesting
            }"
            class="sm fa-sm text-gray-500 text-opacity-90 group-hover:text-blue-500"
            :icon="['fas', 'sync']"
          />
        </div>

        <!-- PAGE LENGTH -->
        <div
          v-click-outside="clickOutsidePageLength"
          class="page-length-selector <lg:hidden bg-white transition-all duration-300 relative border-gray-300 group select-none rounded-sm border py-1 px-2 w-16 flex items-center justify-center hover:bg-gray-50 hover:!border-blue-400 hover:shadow-sm cursor-pointer"
          @click="isPageLengthSelecting = !isPageLengthSelecting"
        >
          <div
            class="page-length-selector flex items-center gap-x-1 text-gray-500 hover:!text-black"
          >
            {{ pageLength }}
            <FontAwesomeIcon
              class="fa-fw fa-sm text-gray-500 page-length-selector"
              :icon="['fas', 'chevron-down']"
            />
          </div>

          <ul
            v-show="isPageLengthSelecting"
            class="absolute top-full right-0 z-50 bg-white w-full border rounded-sm shadow-sm"
          >
            <li
              v-for="length in pageLengthOptions"
              :key="'page-length-' + length"
              class="text-center py-1 hover:bg-gray-100 px-2 py-1"
              @click="setPageLength(length)"
            >
              {{ length }}
            </li>
          </ul>
        </div>
        <!-- PAGE LENGTH END -->
      </div>
      <!-- HEADER TABLE END -->
    </div>
    <ag-grid-vue
      @click="onParentClick"
      @contextmenu="onParentClick"
      @cellContextMenu="onGridCtxMenu"
      @filter-changed="onFilterChanged"
      :enable-cell-text-selection="true"
      class="ag-theme-alpine min-w-full ag-api border-t"
      :class="customClass"
      :column-defs="formattedColumns"
      :default-col-def="defaultColDef"
      :row-data="data"
      :sorting-order="['asc', 'desc']"
      :row-drag-managed="true"
      :animate-rows="true"
      :pagination="false"
      is-row-selectable
      :row-selection="rowSelectionComp"
      :row-multi-select-with-click="prop.selectMulti"
      row-class="ag-grid-row-class"
      :row-height="rowHeight"
      :header-height="32"
      :suppress-row-transform="true"
      @grid-ready="onGridReady"
      @first-data-rendered="autoSizeColumns"
      @bodyScrollEnd="onBodyScrollEnd"
      @row-selected="onRowSelected"
      @selection-changed="onSelectionChanged"
      @rowDoubleClicked="onRowDoubleClicked"
    />
    <div
      v-if="isRequesting"
      class="absolute bottom-8 opacity-70 right-8 animated bg-gray-500 text-white rounded text-xs px-1 py-0.5 flex items-center"
    >
      <FontAwesomeIcon
        class="fa-fw fa-sm group-hover:text-blue-500 animated !animate-spin !animate-duration-800 mr-1"
        :icon="['fas', 'sync']"
      />Loading
    </div>

    <Teleport to="body">
      <div
        v-if="!store.isMobile && mouseX !== null && detailShow && selectedRow"
        class="z-10 fixed top-0 min-w-300px max-w-50vw h-screen overflow-x-hidden scrollbar-thinny overflow-y-auto bg-white bg-opacity-97 shadow-xl animated !animate-duration-150 flex flex-col text-sm items-start justify-start border-gray-400 pt-2 px-2"
        :class="{
          'left-0 !animate-slide-in-left border-r': mouseX < 0,
          'right-0 !animate-slide-in-right border-l': mouseX >= 0
        }"
      >
        <icon
          title="Close Preview"
          fa="times"
          :size="`lg absolute top-2 ${
            mouseX < 0 ? 'left-2' : 'right-2'
          } text-gray-400 z-11 cursor-pointer transform hover:text-red-500 hover:rotate-180 transition-all duration-100`"
          @click="detailShow = false"
        />
        <slot name="preview" :data="selectedRow" />
      </div>
    </Teleport>

    <!-- <Teleport to="body"> -->
    <ul
      ref="contextEl"
      v-if="!store.isMobile && mouseX && prop.ctxActions.length > 0"
      v-click-outside="clickOutsideContextMenu"
      @contextmenu="
        (e) => {
          e.preventDefault()
          return false
        }
      "
      class="z-10 animated animate-fade-in animate-duration-200 fixed w-28 bg-white shadow-xl justify-center !select-none border border-gray-400"
      :style="{
        top: mouseY + 'px',
        left: mouseX + 'px',
        opacity: contextMenuShow ? '100' : '0'
      }"
      @click.self="detailShow = false"
    >
      <!-- context menu -->
      <li
        mobile
        v-for="(action, idx) in prop.ctxActions"
        v-show="action.show ? action.show(selectedRow || {}) : true"
        :key="'action-context-' + idx"
        arrow
        class="py-1 cursor-pointer text-gray-600 px-1 gap-x-2 flex items-center hover:bg-gray-100 border-t justify-between !text-sm rounded-sm hover:text-gray-800 transition-all duration-100"
        @click="onActionClick(action)"
      >
        {{ action.title || '' }}
        <FontAwesomeIcon v-if="action.icon" class="fa-fw fa-sm" :icon="['fas', action.icon]" />
      </li>
    </ul>
    <!-- </Teleport> -->
  </div>
</template>
<script setup>
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { AgGridVue } from 'ag-grid-vue3'
import { ref, inject, onMounted, computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/stores/app'
import IconSearch from '@/components/IconSearch.vue'
import Popper from 'vue3-popper'
import ButtonDropdown from '@/components/ButtonDropdown.vue'

const store = useStore()
const route = useRoute()
const search = ref(null)
const additionalParam = ref({})
const currentEl = ref(null)
const detailShow = ref(false)
const contextEl = ref(null)
const contextMenuShow = ref(false)
const mouseX = ref(null)
const mouseY = ref(null)
const token = ref(localStorage.getItem('authToken') ?? import.meta.env.VITE_AUTH_TOKEN)
const env = ref(import.meta.env.VITE_API_URL)

const prop = defineProps({
  selectMulti: {
    type: Boolean,
    default: false
  },
  selectable: {
    type: Boolean,
    default: () => true
  },
  useDateRange: {
    type: Boolean,
    default: false
  },
  searchInit: {
    type: String,
    default: ''
  },
  isPopup: {
    type: Boolean,
    default: false
  },
  ctxActions: {
    type: Array,
    default() {
      return []
    }
  },
  actions: {
    type: Array,
    default() {
      return []
    }
  },
  contextMenu: {
    type: Array,
    default() {
      return []
    }
  },
  customClass: {
    type: [String, Array],
    default: 'h-[80vh]'
  },
  scopes: {
    type: Array,
    default: () => []
    // [
    //   { name: 'Terkirim', value: 'terkirim' },
    //   { name: 'Diterima', value: 'diterima' }
    // ]
  },
  columns: {
    type: Array,
    default() {
      return []
    }
  },
  currentSelectedRows: {
    type: [Array, Object],
    default() {
      return null
    }
  },
  api: {
    type: Object,
    default: () => {
      return null
    }
  },
  defaultColDef: {
    type: Object,
    default() {
      return {
        headerClass: ['header-justify-center', '!text-xs'],
        sortable: true,
        resizable: true,
        filter: true,
        editable: false,
        suppressFilterButton: false,
        suppressMenu: true,
        suppressKeyboardEvent: (p) => {
          const keyboardKey = p.event.key
          if (keyboardKey === 'Escape') p.node.setSelected(false)
          if (!['ArrowDown', 'ArrowUp'].includes(keyboardKey)) {
            return false
          }

          const lastIdx = p.api.getModel().rowsToDisplay.length - 1
          const idx = p.node.rowIndex

          if (lastIdx === idx && keyboardKey === 'ArrowDown') return false // row terakhir
          if (idx === 0 && keyboardKey === 'ArrowUp') return true // row pertama

          p.node.setSelected(false)
          p.api.forEachNode((node) => {
            if (node.rowIndex === idx + (keyboardKey === 'ArrowDown' ? 1 : -1)) {
              node.setSelected(true)
              return false
            }
          })
          return false
        }
      }
    }
  }
})

const rowSelectionComp = computed(() => {
  if (prop.selectMulti) return 'multiple'
  return 'single'
})

const formattedColumns = computed(() => {
  const cols = [...prop.columns]
  return cols.map((dt, idx) => {
    if (
      store.isMobile &&
      !dt.width &&
      !dt.minWidth &&
      (dt.headerName || '').toLowerCase() !== 'no' &&
      idx > 0
    ) {
      dt.minWidth = 180
    }
    if (dt.field && !dt.valueGetter && dt.field.includes('.')) {
      dt.valueGetter = (p) => p.node.data[dt.field]
    }

    if (typeof dt.filter === 'string') {
      dt['floatingFilterComponent'] = dt.filter
      dt['floatingFilter'] = true
      if (dt.floatingFilterComponentParams) {
        dt.floatingFilterComponentParams.suppressFilterButton = true
      } else {
        dt.floatingFilterComponentParams = {
          suppressFilterButton: true,
          filterKey: (prop.api.filterPrefix || 'filter_') + dt.field
        }
      }
    }
    return dt
  })
})

const data = ref([])
const gridApi = ref(null)
const gridColumnApi = ref(null)
const currentPage = ref(1)
const hasNext = ref(true)
const isShowSelectedOnly = ref(false)
const fakeData = ref([])
const rowHeight = ref(32)
const searchText = ref('')
const pageLength = ref(20)
const pageLengthOptions = ref([20, 25, 50, 100, 250])
const isPageLengthSelecting = ref(false)
const isRequesting = ref(false)
const selectedRow = ref(null)
const selectedRows = ref([])
const chosenScope = ref(null)
const isScopeSelecting = ref(false)
const dateFrom = ref(null)
const isDateFromHover = ref(false)
const dateTo = ref(null)
const isDateToHover = ref(false)
const isForceReload = ref(false)
const maxDateTo = ref(new Date().toISOString().split('T')[0])
const nodes = ref(null)
const currentSelectedEveryFetch = ref([])

function onRowDoubleClicked(evt) {
  const data = evt.data
  emit('rowDoubleClick', data)
}

function getSelectedRows() {
  if (
    !isShowSelectedOnly.value &&
    prop.isPopup &&
    Array.isArray(prop.currentSelectedRows) &&
    prop.currentSelectedRows.length > 0
  ) {
    const currentSelectedArr = prop.currentSelectedRows.map((dtJson) => JSON.stringify(dtJson))
    const selectedBeforeArr = currentSelectedEveryFetch.value.map((dtJson) =>
      JSON.stringify(dtJson)
    )
    const deletedJsonArr = []
    const selectedArr = []

    const fixedArr = [...prop.currentSelectedRows]
    selectedRows.value.forEach((jsonDt) => {
      const stringified = JSON.stringify({ ...jsonDt })
      if (!currentSelectedArr.includes(stringified)) {
        fixedArr.push(jsonDt)
      }
      selectedArr.push(stringified)
    })

    selectedBeforeArr.forEach((stringified) => {
      if (!selectedArr.includes(stringified)) {
        deletedJsonArr.push(stringified)
      }
    })

    return fixedArr.filter((dtJson) => {
      return !deletedJsonArr.includes(JSON.stringify({ ...dtJson }))
    })
  }
  return selectedRows.value
}

function toggleSelectedRows() {
  isShowSelectedOnly.value = !isShowSelectedOnly.value
  if (isShowSelectedOnly.value) {
    gridApi.value.setRowData(prop.currentSelectedRows)
    setTimeout(() => {
      gridApi.value.forEachNode((node) => {
        node.setSelected(true)
      })
    }, 50)
  } else {
    gridApi.value.setRowData(nodes.value)
    setTimeout(() => {
      const currentSelectedArr = prop.currentSelectedRows.map((dtJson) => JSON.stringify(dtJson))
      gridApi.value.forEachNode((node) => {
        if (currentSelectedArr.includes(JSON.stringify({ ...node.data }))) {
          node.setSelected(true)
        }
      })
    }, 50)
  }
}

function clickOutsideContextMenu() {
  detailShow.value = false
  contextMenuShow.value = false
  mouseX.value = null
}

function clickOutsideScope() {
  isScopeSelecting.value = false
}

function clickOutsidePageLength(e) {
  isPageLengthSelecting.value = false
}

function onRowSelected(dt) {
  if (isShowSelectedOnly.value) return
  // const stringified = dt.data
  const isSelected = dt.node.isSelected()
  if (isSelected) {
    currentSelectedEveryFetch.value.push(dt.data)
  }
}

function onSelectionChanged(grid) {
  selectedRows.value = grid.api.getSelectedRows()
  selectedRow.value = null
  setTimeout(() => {
    selectedRow.value = grid.api.getSelectedRows()[0]
    emit('rowClick', selectedRow.value)
  }, 50)
}

function onFilterChanged(e) {
  if (isShowSelectedOnly.value) return
  // console.log('gridApi.getFilterModel() =>', e.api.getFilterModel());
  const filters = { page: 1 }
  let count = 0
  for (let key in e.api.getFilterModel()) {
    const val = e.api.getFilterModel()[key].filter
    if (val && val.includes('~')) {
      filters[(prop.api.wherePrefix || 'if_') + key] = `between ${val}`
    } else {
      filters[(prop.api.filterPrefix || 'filter_') + key] = val
    }
    count++
  }
  if (count > 0) {
    currentPage.value = 1
    gridApi.value.setRowData([])
    gridApi.value.showLoadingOverlay()
    additionalParam.value = filters
    load({ page: 1 })
  } else {
    additionalParam.value = {}
    reload(true)
  }
}

function autoSizeColumns(skipHeader = false) {
  const allColumnIds = []
  if (gridApi.value?.destroyCalled) return
  gridColumnApi.value.getAllColumns()?.forEach((column) => {
    if (column.colDef.suppressSizeToFit) {
      allColumnIds.push(column.getId())
    }
  })

  if (allColumnIds.length > 0) {
    gridColumnApi.value.autoSizeColumns(allColumnIds, skipHeader)
  }
}
function onSearchTextChange(e) {
  if (isShowSelectedOnly.value) return
  if (!e && !searchText.value) {
    emit('escape')
    return
  }

  searchText.value = e ? e.target.value : e
  currentPage.value = 1
  gridApi.value.setRowData([])

  gridApi.value.showLoadingOverlay()
  selectedRow.value = null
  isForceReload.value = true
  load({ page: 1 })
  isForceReload.value = false
}

function reload(force = true) {
  if (isShowSelectedOnly.value) return
  if (isRequesting.value) {
    return
  }
  currentPage.value = 1
  gridApi.value.setRowData([])
  gridApi.value.showLoadingOverlay()
  selectedRow.value = null

  isForceReload.value = force
  load({
    ts: Date.parse(new Date()),
    page: 1
  })
  isForceReload.value = false
}

function setScope(scope) {
  if (isShowSelectedOnly.value) return
  chosenScope.value = scope
  currentPage.value = 1
  gridApi.value.setRowData([])
  gridApi.value.showLoadingOverlay()
  selectedRow.value = null
  isForceReload.value = true
  load()
  isForceReload.value = false
}

function setPageLength(_length) {
  if (isShowSelectedOnly.value) return
  pageLength.value = _length
  currentPage.value = 1
  gridApi.value.setRowData([])
  gridApi.value.showLoadingOverlay()
  selectedRow.value = null
  isForceReload.value = true
  load({ paginate: _length, page: 1 })
  isForceReload.value = false
}

function loadFakeData(count = 10) {
  const rows = []
  for (let i = 0; i < count; i++) {
    const fakeObj = {}
    prop.columns.forEach((element) => {
      if (element.field) {
        fakeObj[element.field] = 'loading'
      }
    })
    rows.push(fakeObj)
  }
  fakeData.value = rows
}
const emit = defineEmits(['rowDoubleClick', 'rowClick', 'escape', 'load'])
function onGridReady(params) {
  gridApi.value = params.api
  gridColumnApi.value = params.columnApi
  gridApi.value.showLoadingOverlay()

  pageLength.value = prop.api?.params?.paginate || pageLength.value
  load(
    {
      ts: Date.parse(new Date()),
      natural: true
    },
    function () {
      autoSizeColumns()
    }
  )
}

function onBodyScrollEnd(evt) {
  if (isShowSelectedOnly.value) return
  const el = document.getElementsByClassName('ag-body-viewport')[0]
  const scrollHeight = el.scrollHeight - el.offsetHeight
  const top = evt.top
  if (
    top + (fakeData.value.length > 0 && data.value.length > 0 ? rowHeight.value * 2 : 0) + 5 >=
      scrollHeight &&
    hasNext.value &&
    currentPage.value !== null
  ) {
    load(
      {
        page: currentPage.value + 1
      },
      function () {
        if (fakeData.value.length === 0) {
          loadFakeData(2)
        }
      }
    )
  }
}

async function load(paramObj = {}, callback = function () {}) {
  if (isShowSelectedOnly.value) return
  const api = prop.api
  const apiParams = additionalParam.value
  const realtimeParams = { ...api.params } || {}

  Object.assign(apiParams, realtimeParams)
  Object.assign(apiParams, paramObj)

  const currentPageTemp = currentPage.value
  currentPage.value = null

  // searching
  Object.assign(apiParams, {
    search: searchText.value
  })

  // paginate / page-length
  if (!apiParams.paginate) {
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

  emit('load', apiParams)
  const paramStr = new URLSearchParams(apiParams)
  const url = api.url + '?' + paramStr

  let rows = []

  if (
    !isForceReload.value &&
    route.query.menu_click &&
    (!apiParams.page || apiParams.page == 1) &&
    store.loadedLandingTable.hasOwnProperty(route.path) &&
    apiParams['natural'] &&
    !prop.isPopup
  ) {
    let responseJson = JSON.parse(store.loadedLandingTable[route.path])
    const successFunction = api.onsuccess
    if (typeof successFunction === 'function') {
      responseJson = successFunction(responseJson)
      currentPage.value = responseJson.page
      hasNext.value = responseJson.hasNext
    } else {
      hasNext.value = false
      currentPage.value += currentPageTemp
    }
    pageLength.value = responseJson.per_page || pageLength.value
    rows = responseJson.data
    searchText.value = responseJson.searchText

    if (rows.length === 0) {
      apiParams['natural'] = false
      load(apiParams)
      return
    }
  } else {
    try {
      isRequesting.value = true
      const result = await fetch(url, {
        headers: api.headers
        // cache: prop.isPopup?'no-cache':'force-cache'
      })
      if (result.ok) {
        let responseJson = await result.json()
        if (!prop.isPopup) {
          setTimeout(() => {
            const copyData = { ...responseJson }
            copyData['searchText'] = searchText.value
            copyData['data'] = getRowData()
            store.loadedLandingTable[route.path] = JSON.stringify(copyData)
          }, 300)
        }
        const successFunction = api.onsuccess
        if (typeof successFunction === 'function') {
          responseJson = successFunction(responseJson)
          currentPage.value = responseJson.page
          hasNext.value = responseJson.hasNext
        } else {
          hasNext.value = false
          currentPage.value += currentPageTemp
        }
        rows = responseJson.data
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
  }
  isRequesting.value = false

  if (gridApi.value?.destroyCalled) return

  gridApi.value.applyTransaction({
    add: [...rows]
  })
  callback(data.value)

  gridApi.value.hideOverlay()
  if (getRowData().length === 0) {
    gridApi.value.showNoRowsOverlay()
  }

  if (prop.isPopup && Array.isArray(prop.currentSelectedRows)) {
    const currentSelectedArr = prop.currentSelectedRows.map((dtJson) => JSON.stringify(dtJson))
    nodes.value = getRowData()
    currentSelectedEveryFetch.value = []
    gridApi.value.forEachNode((node) => {
      if (currentSelectedArr.includes(JSON.stringify({ ...node.data }))) {
        node.setSelected(true)
        currentSelectedEveryFetch.value.push({ ...node.data })
      }
    })
  }
}

function getRowData() {
  if (gridApi.value?.destroyCalled) return []
  const rowData = []
  gridApi.value.forEachNode((node) => rowData.push(node.data))
  return rowData
}

function clearFilters() {
  gridApi.value.setFilterModel(null)
}

onMounted(() => {
  if (prop.searchInit) {
    searchText.value = prop.searchInit
  }
  if (!store.isMobile) {
    search.value.focus()
  }
})

onBeforeMount(() => {
  rowHeight.value = store.isMobile ? 40 : 32
})

async function onCsvExport() {
  const rowCounts = getRowData().length
  const timestamp = new Date().toLocaleDateString('id-ID', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
  const defaultFileName = `${store.currentMenu?.text || 'Data'}-${timestamp}`

  if (!filename) {
    return
  }

  gridApi.value.exportDataAsCsv({
    prependContent:
      `Judul :,${store.currentMenu?.text || 'Data'}\nTotal :,${rowCounts} data\n` +
      `Dicetak :,${timestamp}\nOleh:,${store.user.data.name}\n`,
    appendContent: '',
    allColumns: true,
    suppressQuotes: undefined,
    columnSeparator: undefined,
    fileName: `${filename}.csv`,
    processCellCallback: (exportParam) => {
      const value = exportParam.value
      const formatted =
        value && typeof value === 'string' ? value.replace(/\./g, '').replace(/,/g, '.') : NaN
      let classes = exportParam.column.colDef.cellClass
      if (typeof exportParam.column.colDef.cellClass === 'function') {
        classes = classes(exportParam)
      }
      if (!isNaN(formatted) && Array.isArray(classes) && classes.includes('justify-end')) {
        return formatted
      }
      return value
    }
  })
}

//  DALAM PROSES
function onBtPrint() {
  const api = gridApi.value
  setPrinterFriendly(api)
  setTimeout(function () {
    print()
    setNormal(api)
  }, 2000)
}

function setPrinterFriendly(api) {
  const eGridDiv = document.querySelector('#grid-api')
  eGridDiv.style.height = ''
  api.setDomLayout('print')
}

function setNormal(api) {
  const eGridDiv = document.querySelector('#grid-api')
  eGridDiv.style.width = '700px'
  eGridDiv.style.height = '200px'
  api.setDomLayout()
}

function showDetail() {
  detailShow.value = true
}

function onGridCtxMenu(e) {
  if (prop.ctxActions.length === 0) {
    return true
  }
  e.node.setSelected(true)
  selectedRow.value = e.api.getSelectedRows()[0]
}

async function onActionClick(action) {
  // await window.delay(100)
  mouseX.value = null
  action.click(selectedRow.value)
}

async function onParentClick(e) {
  if (mouseX.value) {
    mouseX.value = null
    contextMenuShow.value = false
    detailShow.value = false
    // await window.delay(100)
  }

  const classes = Array.from(e.target.classList).join(' ')
  if (e.type === 'click') {
    if (classes.includes('ag-cell') || classes.includes('ag-row')) {
      mouseX.value = window.innerWidth / 2 - e.clientX
    } else {
      mouseX.value = null
    }
  }

  if (prop.ctxActions.length === 0) {
    return true
  }

  e.preventDefault()

  if (classes.includes('ag-cell') || classes.includes('ag-row')) {
    mouseX.value = e.clientX + 1
    mouseY.value = e.clientY + 6

    // await window.delay(100)
    const elWidth = contextEl.value.getBoundingClientRect().width
    const elHeight = contextEl.value.getBoundingClientRect().height

    if (mouseX.value + elWidth > window.innerWidth) {
      mouseX.value = window.innerWidth - elWidth - 5
    }
    if (mouseY.value + elHeight > window.innerHeight) {
      mouseY.value = window.innerHeight - elHeight - 5
    }
    contextMenuShow.value = true
  } else {
    mouseX.value = null
    mouseY.value = null
  }
  return false
}

defineExpose({
  showDetail,
  reload,
  getSelectedRows,
  toggleSelectedRows
})
</script>

<style>
/* .ag-center-cols-container{
      @apply !w-full;
  }
  
  .ag-header-row.ag-header-row-column{
      @apply !w-full;
  } */
.ag-header.ag-focus-managed.ag-pivot-off {
  height: 32px;
  min-height: 32px;
}

.header-justify-center .ag-header-cell-label {
  justify-content: center !important;
}

.ag-paging-panel {
  height: 28px !important;
}

.ag-theme-alpine .ag-root-wrapper {
  @apply !rounded-sm;
}

.ag-grid-row-class {
  @apply !cursor-pointer;
}

.ag-api .ag-cell {
  @apply !px-2 overflow-clip !text-xs flex items-center;
}

.ag-api .ag-header-row-column-filter {
  @apply !flex items-center justify-center !h-[40px] !mt-[4px];
}

.ag-api .ag-header-cell.ag-floating-filter {
  @apply px-1;
}

.ag-api .ag-header-cell.ag-floating-filter .ag-input-field-input.ag-text-field-input {
  @apply !px-1 py-1;
}

.ag-api .ag-header-cell.ag-floating-filter .ag-input-field {
  @apply !px-0.5;
}
/* .ag-api .ag-header.ag-focus-managed.ag-pivot-off {
  @apply !min-h-[75px];
} */

.ag-api .ag-floating-filter-full-body {
  @apply items-start pt-1;
}

.ag-body-viewport::-webkit-scrollbar {
  /* display: none !important; */
  width: 6.5px !important;
  height: 6.5px !important;
}

/* Track */
.ag-body-viewport::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

/* Handle */
.ag-body-viewport::-webkit-scrollbar-thumb {
  @apply bg-gray-400 !cursor-pointer bg-opacity-40;
}

/* Handle on hover */
.ag-body-viewport::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 !cursor-pointer bg-opacity-40;
}

.ag-body-horizontal-scroll-viewport::-webkit-scrollbar {
  /* display: none !important; */
  height: 5.5px !important;
}

/* Track */
.ag-body-horizontal-scroll-viewport::-webkit-scrollbar-track {
  @apply bg-transparent;
}

/* Handle */
.ag-body-horizontal-scroll-viewport::-webkit-scrollbar-thumb {
  @apply bg-gray-400 !cursor-pointer bg-opacity-40;
}

/* Handle on hover */
.ag-body-horizontal-scroll-viewport::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 !cursor-pointer bg-opacity-70;
}
.ag-theme-alpine .ag-row {
  border-width: 0.5px;
}
</style>
