<script setup>
import { reactive, ref } from 'vue'
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
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import ButtonMultiSelect from '@/components/forms/ButtonMultiSelect.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import BaseIcon from '@/components/BaseIcon.vue'
import router from '@/router'

const route = useRoute()
const baseUrl = ref(import.meta.env.VITE_API_URL)
const token = ref(localStorage.getItem('authToken'));
const endpointApi = 'm_unit'

const mainStore = useMainStore()
const apiTable = ref()
const actionText = ref(route.params.id === 'create' ? 'Tambah' : route.query.action)
const formErrors = ref({})
const detailArr = ref(mainStore.clients)

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
    url: `${baseUrl.value}/operation/${endpointApi}`,
    headers: {
      'Content-Type': 'Application/json',
      authorization: `Bearer ${token.value}`
    },
    params: {
      simplest: true,
      searchfield: 'this.id, this.code, this.name, this.desc, this.is_active'
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
      headerName: 'Kode',
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
</script>
<style>
.datePickerCustomCalender {
  font-size: 0.8rem;
}
.datePickerCustomCell {
  width: 30px;
  height: 20px;
  font-size: 0.8rem;
}

.datePickerCustomMenu {
  font-size: 0.8rem;
}

.datePickerCustom {
  padding-top: 0;
  padding-bottom: 0;
  max-width: 100%;
  width: 100%;
  height: 32px;
  border-radius: 0.5rem;
  border: 1px solid #374151;
  font-size: 0.875rem;
  background-color: white;
  transition: all 300ms;
  outline: none;
}
.datePickerCustom::placeholder {
  color: #6b7280;
}
.datePickerCustom:hover {
  border: 1px solid #374151 !important;
}
.datePickerCustomMenu:hover ~ .datePickerCustom,
.datePickerCustomMenu:focus-within ~ .datePickerCustom {
  border-color: #3b82f6 !important;
}
.datePickerCustom:focus-within,
.dp__input_focus {
  border: 1px solid #3b82f6 !important;
  box-shadow: 0 0 0 1px #3b82f6; /* Efek seperti ring */
}
</style>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Satuan Barang" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField>
          <TableApi
            ref="apiTable"
            :api="landing.api"
            :columns="landing.columns"
            :actions="landing.actions"
            class="max-h-[450px]"
          >
          </TableApi>
        </FormField>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
