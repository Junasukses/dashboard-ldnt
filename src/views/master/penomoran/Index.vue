<script setup>
import { reactive, ref } from 'vue'
import { mdiAccountGroupOutline, mdiBallotOutline } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import BaseButton from '@/components/BaseButton.vue'

const route = useRoute()
const baseUrl = ref(import.meta.env.VITE_API_URL)
const token = ref(localStorage.getItem('token') ?? import.meta.env.VITE_AUTH_TOKEN)
const formatApiTable = ref()
const landingApiTable = ref()
const activeTabIndex = ref(route.query.activeTab ? parseInt(route.query.activeTab) : 1)

const landing_format = reactive({
  actions: [
    {
      icon: 'eye',
      title: 'Read',
      class: 'bg-green-600 text-slate-100',
      click(row) {
        router.push(`${route.path}/format/${row.id}`)
      }
    },
    {
      icon: 'edit',
      title: 'Edit',
      class: 'bg-blue-600 text-slate-100',
      click(row) {
        router.push(`${route.path}/format/${row.id}?action=Edit`)
      }
    },
    {
      icon: 'copy',
      title: 'Copy',
      class: 'bg-gray-600 text-slate-100',
      click(row) {
        router.push(`${route.path}/format/${row.id}?action=Copy`)
      }
    }
  ],
  api: {
    url: `${baseUrl.value}/operation/generate_code`,
    headers: {
      'Content-Type': 'Application/json',
      authorization: `Bearer ${token.value}`
    },
    params: {
      simplest: true,
      searchfield: 'm_bu.name, m_menu.menu, this.identifier, this.is_active'
    },
    onsuccess(response) {
      response.page = response.current_page
      response.hasNext = response.has_next
      return response
    }
  },
  columns: [
    {
      headerName: 'No',
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 60,
      sortable: true,
      resizable: true,
      filter: true,
      cellClass: ['justify-center', 'bg-gray-50', 'border-r', '!border-gray-200']
    },
    {
      field: 'm_bu.name',
      headerName: 'Business Unit',
      filter: true,
      sortable: true,
      flex: 1,
      filter: 'ColFilter',
      resizable: true,
      wrapText: true,
      cellClass: ['border-r', '!border-gray-200', 'justify-start']
    },
    {
      field: 'm_menu.menu',
      headerName: 'Menu',
      filter: true,
      sortable: true,
      flex: 1,
      filter: 'ColFilter',
      resizable: true,
      wrapText: true,
      cellClass: ['border-r', '!border-gray-200', 'justify-start']
    },
    {
      field: 'identifier',
      headerName: 'Identifier',
      filter: true,
      sortable: true,
      flex: 1,
      filter: 'ColFilter',
      resizable: true,
      wrapText: true,
      cellClass: ['border-r', '!border-gray-200', 'justify-start']
    },
    {
      field: 'is_active',
      headerName: 'Status',
      filter: true,
      filter: 'ColFilter',
      sortable: true,
      flex: 1,
      cellClass: ['border-r', '!border-gray-200', 'justify-center'],
      cellRenderer: ({ value }) => {
        return value === true
          ? `<span class="text-green-500 rounded-md text-xs font-medium px-4 py-1 inline-block capitalize">Active</span>`
          : `<span class="text-gray-500 rounded-md text-xs font-medium px-4 py-1 inline-block capitalize">Inactive</span>`
      }
    }
  ]
})

const landing_prefix = reactive({
  actions: [
    {
      icon: 'eye',
      title: 'Read',
      class: 'bg-green-600 text-slate-100',
      click(row) {
        router.push(`${route.path}/prefix/${row.id}`)
      }
    },
    {
      icon: 'edit',
      title: 'Edit',
      class: 'bg-blue-600 text-slate-100',
      click(row) {
        router.push(`${route.path}/prefix/${row.id}?action=Edit`)
      }
    },
    {
      icon: 'copy',
      title: 'Copy',
      class: 'bg-gray-600 text-slate-100',
      click(row) {
        router.push(`${route.path}/prefix/${row.id}?action=Copy`)
      }
    }
  ],
  api: {
    url: `${baseUrl.value}/operation/generate_code_type`,
    headers: {
      'Content-Type': 'Application/json',
      authorization: `Bearer ${token.value}`
    },
    params: {
      simplest: true,
      searchfield: 'm_bu.name, this.name, this.ref_type, this.value, this.is_active'
    },
    onsuccess(response) {
      response.page = response.current_page
      response.hasNext = response.has_next
      return response
    }
  },
  columns: [
    {
      headerName: 'No',
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 60,
      sortable: true,
      resizable: true,
      filter: true,
      cellClass: ['justify-center', 'bg-gray-50', 'border-r', '!border-gray-200']
    },
    {
      field: 'm_bu.name',
      headerName: 'Business Unit',
      filter: true,
      sortable: true,
      flex: 1,
      filter: 'ColFilter',
      resizable: true,
      wrapText: true,
      cellClass: ['border-r', '!border-gray-200', 'justify-start']
    },
    {
      field: 'name',
      headerName: 'Name',
      filter: true,
      sortable: true,
      flex: 1,
      filter: 'ColFilter',
      resizable: true,
      wrapText: true,
      cellClass: ['border-r', '!border-gray-200', 'justify-start']
    },
    {
      field: 'ref_type',
      headerName: 'Tipe',
      filter: true,
      sortable: true,
      flex: 1,
      filter: 'ColFilter',
      resizable: true,
      wrapText: true,
      cellClass: ['border-r', '!border-gray-200', 'justify-start']
    },
    {
      field: 'value',
      headerName: 'Value',
      filter: true,
      sortable: true,
      flex: 1,
      filter: 'ColFilter',
      resizable: true,
      wrapText: true,
      cellClass: ['border-r', '!border-gray-200', 'justify-start']
    },
    {
      field: 'is_active',
      headerName: 'Status',
      filter: true,
      filter: 'ColFilter',
      sortable: true,
      flex: 1,
      cellClass: ['border-r', '!border-gray-200', 'justify-center'],
      cellRenderer: ({ value }) => {
        return value === true
          ? `<span class="text-green-500 rounded-md text-xs font-medium px-4 py-1 inline-block capitalize">Active</span>`
          : `<span class="text-gray-500 rounded-md text-xs font-medium px-4 py-1 inline-block capitalize">Inactive</span>`
      }
    }
  ]
})

const changeActiveTab = (num) => {
  route.query.activeTab = num
  activeTabIndex.value = parseInt(route.query.activeTab)
}
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Setting Penomoran" main>
      </SectionTitleLineWithButton>
      <div class="flex gap-4 mb-4">
        <div
          class="flex items-center p-2 rounded-md cursor-pointer duration-300 transition border border-[#086968]"
          :class="
            activeTabIndex == 1
              ? 'text-white bg-[#086968]'
              : 'text-[#086968] hover:bg-gray-100 bg-white'
          "
          @click="changeActiveTab(1)"
        >
          <BaseIcon :path="mdiAccountGroupOutline" size="20" />
          <span class="ml-2">Format Penomoran</span>
        </div>
        <div
          class="flex items-center p-2 rounded-md cursor-pointer duration-300 transition border border-[#086968]"
          :class="
            activeTabIndex == 2
              ? 'text-white bg-[#086968]'
              : 'text-[#086968] hover:bg-gray-100 bg-white'
          "
          @click="changeActiveTab(2)"
        >
          <BaseIcon :path="mdiAccountGroupOutline" size="20" />
          <span class="ml-2">Prefix Penomoran</span>
        </div>
      </div>
      <CardBox class="border border-[#086968]">
        <FormField v-show="activeTabIndex === 1">
          <TableApi
            ref="formatApiTable"
            :api="landing_format.api"
            :columns="landing_format.columns"
            :actions="landing_format.actions"
            class="max-h-[450px]"
          >
            <template #header>
              <BaseButton
                @click="router.replace(`${route.path}/format/create`)"
                type="submit"
                color="info"
                label="Create New"
                outline
                small
              />
            </template>
          </TableApi>
        </FormField>
        <FormField v-show="activeTabIndex === 2">
          <TableApi
            ref="landingApiTable"
            :api="landing_prefix.api"
            :columns="landing_prefix.columns"
            :actions="landing_prefix.actions"
            class="max-h-[450px]"
          >
            <template #header>
              <BaseButton
                @click="router.replace(`${route.path}/prefix/create`)"
                type="submit"
                color="info"
                label="Create New"
                outline
                small
              />
            </template>
          </TableApi>
        </FormField>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
