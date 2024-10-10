<script setup>
import { reactive, ref, onActivated } from 'vue'
import {
  mdiBallotOutline,
  mdiAccount,
  mdiMail,
  mdiPlus,
  mdiEye,
  mdiTrashCan,
  mdiCalendar,
  mdiCalendarMonth
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadioGroup from '@/components/FormCheckRadioGroup.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import FormField from '@/components/FormField.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import BaseIcon from '@/components/BaseIcon.vue'
import router from '@/router'
import { useStore } from '@/stores/app'
import alertify from 'alertifyjs'
import axios from 'axios'
import BaseButton from '@/components/BaseButton.vue'

const route = useRoute()
const token = ref(localStorage.getItem('token') ?? import.meta.env.VITE_AUTH_TOKEN)
const endpointApi = 'm_bu'

const store = useStore()
const apiTable = ref()
const landing = reactive({
  actions: [
    {
      icon: 'trash',
      class: 'bg-red-600 text-slate-100',
      title: 'Hapus',
      click(row) {
        alertify.confirm(
          'Perhatian',
          `Hapus Data Terpilih?`,
          async () => {
            try {
              store.setRequesting(true)
              const response = await axios({
                method: 'delete',
                url: `/operation/${endpointApi}/${row.id}`,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                }
              })
              const resultJson = response.data
              alertify.success(resultJson.message || 'Success remove data')
              apiTable.value.reload()
            } catch (err) {
              console.log(err)
              alertify.error(err.message || 'Failed when trying to remove data')
            }

            store.setRequesting(false)
          },
          () => {}
        )
      }
    },
    {
      icon: 'eye',
      title: 'Read',
      class: 'bg-green-600 text-slate-100',
      click(row) {
        router.push(`${route.path}/${row.id}`)
      }
    },
    {
      icon: 'edit',
      title: 'Edit',
      class: 'bg-blue-600 text-slate-100',
      click(row) {
        router.push(`${route.path}/${row.id}?action=Edit`)
      }
    },
    {
      icon: 'copy',
      title: 'Copy',
      class: 'bg-gray-600 text-slate-100',
      click(row) {
        router.push(`${route.path}/${row.id}?action=Copy`)
      }
    },

    {
      icon: 'location-arrow',
      title: 'Post Data',
      class: 'bg-rose-700 rounded-lg text-white',
      show: (row) => row.status?.toUpperCase() === 'DRAFT',
      async click(row) {
        alertify.confirm(
          'Perhatian',
          `Post Data?`,
          async () => {
            try {
              store.setRequesting(true)
              const response = await axios({
                method: 'post',
                url: `/operation/${endpointApi}/post`,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                data: JSON.stringify({ id: row.id })
              })
              const resultJson = response.data
              alertify.success(resultJson.message || 'Success Post data')
              apiTable.value.reload()
            } catch (err) {
              console.log(err)
              alertify.error(err.message || 'Failed when trying to post data')
            }

            store.setRequesting(false)
          },
          () => {}
        )
      }
    }
  ],
  api: {
    url: `${store.server}/operation/${endpointApi}`,
    headers: {
      'Content-Type': 'Application/json',
      authorization: `Bearer ${token.value}`
    },
    params: {
      simplest: true,
      searchfield: 'this.id, this.code, this.name, this.note, this.is_active'
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
      field: 'code',
      headerName: 'Code',
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
      headerName: 'Nama',
      filter: true,
      sortable: true,
      flex: 1,
      filter: 'ColFilter',
      resizable: true,
      wrapText: true,
      cellClass: ['border-r', '!border-gray-200', 'justify-start']
    },
    {
      field: 'note',
      headerName: 'Catatan',
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
onActivated(() => {
  if (apiTable.value) {
    if (route.query.reload) {
      apiTable.value.reload()
    }
  }
})
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Business Unit" main>
      </SectionTitleLineWithButton>
      <CardBox class="border border-[#086968]">
        <FormField>
          <TableApi
            ref="apiTable"
            :api="landing.api"
            :columns="landing.columns"
            :actions="landing.actions"
            class="max-h-[450px]"
          >
            <template #header>
              <BaseButton
                @click="router.push(`${route.path}/create`)"
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
