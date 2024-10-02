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

const route = useRoute()
const token = ref(localStorage.getItem('token') ?? import.meta.env.VITE_AUTH_TOKEN)
const endpointApi = 't_disc'

const store = useStore()
const apiTable = ref()
const data = reactive({
  discount_type: 'REGULER'
})
const landing = reactive({
  actions: [
    {
      icon: 'trash',
      class: 'bg-red-600 text-slate-100',
      title: 'Hapus'
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
      searchfield: 'this.id, this.discount_type, this.name, this.desc, this.status'
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
      field: 'desc',
      headerName: 'Deskripsi',
      filter: true,
      sortable: true,
      flex: 1,
      filter: 'ColFilter',
      resizable: true,
      wrapText: true,
      cellClass: ['border-r', '!border-gray-200', 'justify-start']
    },
    {
      field: 'discount_type',
      headerName: 'Discount Type',
      filter: true,
      sortable: true,
      flex: 1,
      filter: 'ColFilter',
      resizable: true,
      wrapText: true,
      cellClass: ['border-r', '!border-gray-200', 'justify-start']
    },
    {
      field: 'status',
      headerName: 'Status',
      filter: true,
      filter: 'ColFilter',
      sortable: true,
      flex: 1,
      cellClass: ['border-r', '!border-gray-200', 'justify-center']
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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Diskon" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField>
          <div class="flex flex-col w-full col-span-2">
            <div class="flex justify-between">
              <div class="flex items-center w-[50%]">
                <label class="block font-bold mb-2 mr-4 w-[40%]">Discount Type :</label>
                <FieldSelect
                  :bind="{ disabled: false, clearable: false }"
                  :value="data.discount_type"
                  @input="(v) => (data.discount_type = v)"
                  :check="false"
                  :options="['REGULER', 'PROGRESIF', 'GLOBAL']"
                  placeholder="Pilih Discount Type"
                  label=""
                  class="!mt-0"
                />
              </div>

              <div>
                <RouterLink
                  :to="`${route.path}/create?type=${data.discount_type}&${Date.parse(new Date())}`"
                  class="border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white duration-300 transform hover:-translate-y-0.5 rounded-md py-1 px-2"
                >
                  Create New
                </RouterLink>
              </div>
            </div>
            <TableApi
              ref="apiTable"
              :api="landing.api"
              :columns="landing.columns"
              :actions="landing.actions"
              class="max-h-[450px]"
            >
            </TableApi>
          </div>
        </FormField>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
