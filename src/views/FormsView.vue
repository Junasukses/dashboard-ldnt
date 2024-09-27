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

const route = useRoute()
const baseUrl = ref(import.meta.env.VITE_API_URL)
const token = ref(
  localStorage.getItem('authToken') ??
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMzRmOTJiN2Y5ZWQ2NTljMjRkYzY1ODAyODg4OWUxNTk5ZDZiY2M2ZmM3YjJjN2VlMmU0YWI3YWVlYTdiMTU3MWY1ZDRmYjM4OGUyNjZlZjAiLCJpYXQiOjE3MjY4ODAzMTAuMzc2MjQ3LCJuYmYiOjE3MjY4ODAzMTAuMzc2MjUxLCJleHAiOjE3NTg0MTYzMTAuMzcwNDY5LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.rQ13lQsgWyehnxe0UMphZl3iMGvTo5NVc0DQFQBupbdn0foOu70b-8R7sUyonRrxqa691iv9Xuqd2jpIvCA3YTHJalf-75UbtM4c4mfUm4tpzuMFtUZMjYaSrccvnc45nMmAMFJgmmCd8rVZCID1fFPnLdOHMqii9kluIscOZwC29g-Qsl-4IIUeWTERUWKdFIz8I_wzNMFC7Km_1cNQ-vFHMtuLe-JL5PqR9BwTWKgrDeG41t8S52YXKPZrDDkTeWtDqwSmKkVU7nmDynFbH2lBslMuN_w9rd2kesdSTIg8_RoVvGKxoqJ0dcuVtF3DRli5tKv50qzPzAibCH53hYOqLNhOim7O8v4r-uwLw2betSdJoQn_xXFYsmW2O6sJDRP3Rk-mXzOKPs-uBjsrTNGkdX0y91NqeXKMQ2qUsVprPXMv71Felgz5YsmthUwu0vYQXf62wAbzWJS-U_sR-m0V_PiE5TfTSlmJHcWAzP3BSFye9RjOhOwknV0dkFgD9mTpxhbc-E0PfQW74ZXoFRj_obpbnQXBNLMXumPgHAS5DShI0zp3UKLIKGPFS73bByBjMdAg5hwTzjKa2MsnarkeDt0g8QT6MHES14mcEPz_HXOTfqahU-_5MzhLDczZhYxiVGq9OCoO1sRLBKZfz0I3V0UfwSCnNyuZEn17n8Q'
)
const endpointApi = 'm_approval'

const selectOptions = [
  { id: 1, label: 'Business development' },
  { id: 2, label: 'Marketing' },
  { id: 3, label: 'Sales' }
]

// const selectOptions = ['Business development', 'Marketing', 'Sales']

const mainStore = useMainStore()
const apiTable = ref()
const actionText = ref(route.params.id === 'create' ? 'Tambah' : route.query.action)
const formErrors = ref({})
const detailArr = ref(mainStore.clients)

const form = reactive({
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '',
  department: selectOptions[0],
  subject: '',
  question: ''
})

const customElementsForm = reactive({
  checkbox: ['lorem'],
  radio: 'one',
  switch: ['one'],
  file: null
})

const submit = () => {
  //
}

const formStatusWithHeader = ref(true)

const formStatusCurrent = ref(0)

const formStatusOptions = ['info', 'success', 'danger', 'warning']

const formStatusSubmit = () => {
  formStatusCurrent.value = formStatusOptions[formStatusCurrent.value + 1]
    ? formStatusCurrent.value + 1
    : 0
}

const onDetailAdd = (e) => {
  e.forEach((row) => {
    if (row.uid) {
      delete row.uid
    }
    detailArr.value.push(row)
  })
}

const landing = reactive({
  actions: [
    {
      icon: 'trash',
      class: 'bg-red-600 text-slate-100',
      title: 'Hapus'
      // show: () => store.user.data.username==='developer',
      // click(row) {
      //   swal
      //     .fire({
      //       icon: 'warning',
      //       text: 'Hapus Data Terpilih?',
      //       confirmButtonText: 'Yes',
      //       showDenyButton: true
      //     })
      //     .then(async (result) => {
      //       if (result.isConfirmed) {
      //         try {
      //           const dataURL = `${baseUrl.value}/operation/${endpointApi}/${row.id}`
      //           isRequesting.value = true
      //           const res = await fetch(dataURL, {
      //             method: 'DELETE',
      //             headers: {
      //               'Content-Type': 'Application/json',
      //               Authorization: `Bearer ${token.value}`
      //             }
      //           })
      //           if (!res.ok) {
      //             const resultJson = await res.json()
      //             throw resultJson.message || 'Failed when trying to remove data'
      //           }
      //           apiTable.value.reload()
      //           // const resultJson = await res.json()
      //         } catch (err) {
      //           isBadForm.value = true
      //           swal.fire({
      //             icon: 'error',
      //             text: err
      //           })
      //         }
      //         isRequesting.value = false
      //       }
      //     })
      // }
    },
    {
      icon: 'eye',
      title: 'Read',
      class: 'bg-green-600 text-slate-100',
      click(row) {
        router.push(`${route.path}/${row.id}?` + tsId)
      }
    },
    {
      icon: 'edit',
      title: 'Edit',
      class: 'bg-blue-600 text-slate-100',
      click(row) {
        router.push(`${route.path}/${row.id}?action=Edit&` + tsId)
      }
    },
    {
      icon: 'copy',
      title: 'Copy',
      class: 'bg-gray-600 text-slate-100',
      click(row) {
        router.push(`${route.path}/${row.id}?action=Copy&` + tsId)
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
      searchfield: 'this.id, this.code, m_menu.menu, this.name, this.note, this.is_active'
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
      filter: 'ColFilter',
      resizable: true,
      wrapText: true,
      flex: 1,
      cellClass: ['border-r', '!border-gray-200', 'justify-start']
    },
    {
      field: 'is_active',
      headerName: 'Status',
      filter: true,
      filter: 'ColFilter',
      // resizable: true,
      // valueGetter: (p) => p.node.data['status'].toLowerCase()==='active'? 'Aktif':'Tidak Aktif',
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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Forms example" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField>
          <div>
            <label class="block font-bold mb-2">Grouped with icons</label>
            <FormControl v-model="form.name" :icon="mdiAccount" />
          </div>
          <div>
            <label class="block font-bold mb-2">Inline with icons</label>
            <FormControl v-model="form.email" type="email" :icon="mdiMail" />
          </div>
        </FormField>

        <FormField help="Do not enter the leading zero">
          <div>
            <label class="block font-bold mb-2">With help line</label>
            <FormControl v-model="form.phone" type="tel" placeholder="Your phone number" />
          </div>
          <div>
            <label class="block font-bold mb-2">Date</label>

            <VueDatePicker
              :ui="{
                input: 'datePickerCustom',
                calender: 'datePickerCustomCalendar',
                calendarCell: 'datePickerCustomCell',
                menu: 'datePickerCustomMenu'
              }"
              v-model="form.date"
              format="yyyy/dd/MM"
              :enable-time-picker="false"
              placeholder="Select Date"
            >
              <template #input-icon>
                <BaseIcon
                  :path="mdiCalendarMonth"
                  w="w-10"
                  h="h-10"
                  class="pointer-events-none text-gray-500 dark:text-slate-400 mr-5"
                />
              </template>
            </VueDatePicker>
          </div>
        </FormField>
        <FormField>
          <div>
            <label class="block font-bold mb-2">Field Pop Up</label>
            <FieldPopup
              :api="{
                url: `${baseUrl}/operation/m_supp`,
                headers: {
                  'Content-Type': 'Application/json',
                  Authorization: `Bearer ${token}`
                },
                params: {
                  simplest: true,
                  where: 'this.is_active = true',
                  searchfield: 'this.name,this.email,this.phone_1,city.value1'
                }
              }"
              valueField="id"
              displayField="name"
              :bind="{ readonly: false }"
              :value="form.m_supp_id"
              @input="(v) => (form.m_supp_id = v)"
              :errorText="formErrors.m_supp_id ? 'failed' : ''"
              :hints="formErrors.m_supp_id"
              placeholder="Pilih Supplier"
              label="Supplier"
              :check="false"
              :columns="[
                {
                  checkboxSelection: true,
                  headerCheckboxSelection: true,
                  headerName: 'No',
                  valueGetter: (p) => '',
                  width: 60,
                  sortable: false,
                  resizable: true,
                  filter: false,
                  cellClass: ['justify-center', 'bg-gray-50', '!border-gray-200']
                },
                {
                  flex: 1,
                  field: 'name',
                  headerName: 'Nama Supplier',
                  sortable: false,
                  resizable: true,
                  filter: 'ColFilter',
                  cellClass: ['border-r', '!border-gray-200', 'justify-center']
                },
                {
                  flex: 1,
                  field: 'phone_1',
                  headerName: 'No. Telephone',
                  sortable: false,
                  resizable: true,
                  filter: 'ColFilter',
                  cellClass: ['border-r', '!border-gray-200', 'justify-center']
                },
                {
                  flex: 1,
                  field: 'email',
                  headerName: 'Email',
                  sortable: false,
                  resizable: true,
                  filter: 'ColFilter',
                  cellClass: ['border-r', '!border-gray-200', 'justify-center']
                },
                {
                  flex: 1,
                  field: 'city.value1',
                  headerName: 'Kota',
                  sortable: false,
                  resizable: true,
                  filter: 'ColFilter',
                  cellClass: ['border-r', '!border-gray-200', 'justify-center']
                }
              ]"
            />
          </div>
          <div>
            <label class="block font-bold mb-2">Field Upload</label>
            <FieldUpload
              :value="form.file"
              @input="(v) => (form.file = v)"
              :errorText="formErrors.file ? 'failed' : ''"
              :hints="formErrors.file"
              :maxSize="10"
              :reducerDisplay="
                (val) => (!val ? null : val.split(':::')[val.split(':::').length - 1])
              "
              :api="{
                url: `${baseUrl}/operation/m_cust_d_upload/upload`,
                headers: { Authorization: `Bearer ${token}` },
                params: { field: 'file' },
                onsuccess: (response) => response,
                onerror: (error) => {}
              }"
              placeholder="Pilih File"
              fa-icon="upload"
              accept=".png,.jpg"
              :check="false"
            />
          </div>
        </FormField>

        <FormField>
          <div>
            <label class="block font-bold mb-2">Dropdown Static</label>
            <FieldSelect
              v-model="form.department"
              :options="selectOptions"
              display-key="label"
              value-key="id"
            />
          </div>
          <div>
            <label class="block font-bold mb-2">Dropdown Api</label>
            <FieldSelect
              v-model="form.apiDept"
              display-key="name"
              value-key="id"
              :api="{
                url: `${baseUrl}/operation/m_supp`,
                headers: {
                  'Content-Type': 'Application/json',
                  Authorization: `Bearer ${token}`
                },
                params: {
                  simplest: true,
                  where: 'this.is_active = true',
                  searchfield: 'this.name,this.email,this.phone_1,city.value1'
                }
              }"
            />
          </div>
        </FormField>

        <BaseDivider />

        <FormField label="Question" help="Your question. Max 255 characters">
          <FormControl type="textarea" placeholder="Explain how we can help you" />
        </FormField>

        <BaseDivider />
        <FormField label="Table Api" help="Table for list data">
          <TableApi
            ref="apiTable"
            :api="landing.api"
            :columns="landing.columns"
            :actions="landing.actions"
            class="max-h-[450px]"
          >
          </TableApi>
        </FormField>

        <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Forms example detail">
          <div class="flex my-auto h-6 w-0.5 bg-gray-900 mx-3"></div>
          <ButtonMultiSelect
            title="Add To List"
            @add="onDetailAdd"
            :api="{
              url: `${baseUrl}/operation/m_supp`,
              headers: {
                'Content-Type': 'Application/json',
                Authorization: `Bearer ${token}`
              },
              params: {
                simplest: true
              },
              onsuccess: (response) => {
                response.data = [...response.data].map((dt) => {
                  return dt
                })
                response.page = response.current_page
                response.hasNext = response.has_next
                return response
              }
            }"
            :columns="[
              {
                checkboxSelection: true,
                headerCheckboxSelection: true,
                headerName: 'No',
                valueGetter: (p) => '',
                width: 60,
                sortable: false,
                resizable: true,
                filter: false,
                cellClass: ['justify-center', 'bg-gray-50', '!border-gray-200']
              },
              {
                flex: 1,
                field: 'name',
                headerName: 'Nama Supplier',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'phone_1',
                headerName: 'No. Telephone',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'email',
                headerName: 'Email',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'city.value1',
                headerName: 'Kota',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              }
            ]"
          >
            <BaseButton color="info" label="Add To List" small :icon="mdiPlus" />
          </ButtonMultiSelect>
        </SectionTitleLineWithButton>

        <div class="relative overflow-x-auto">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3 w-[5%]">No</th>
                <th scope="col" class="px-6 py-3">Nama</th>
                <th scope="col" class="px-6 py-3">Company</th>
                <th scope="col" class="px-6 py-3">City</th>
                <th scope="col" class="px-6 py-3">Progress</th>
                <th scope="col" class="px-6 py-3">Created</th>
                <th scope="col" class="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="detailArr.length > 0"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                v-for="(client, i) in detailArr"
                :key="client.id"
              >
                <td class="px-6 py-4">
                  {{ i + 1 }}
                </td>
                <td class="px-6 py-4">
                  {{ client.name }}
                </td>
                <td class="px-6 py-4">
                  {{ client.company }}
                </td>
                <td class="px-6 py-4">
                  {{ client.city }}
                </td>
                <td class="px-6 py-4">
                  <progress
                    class="flex w-2/5 self-center lg:w-full"
                    max="100"
                    :value="client.progress"
                  >
                    {{ client.progress }}
                  </progress>
                </td>
                <td class="px-6 py-4">
                  <small class="text-gray-500 dark:text-slate-400" :title="client.created">{{
                    client.created
                  }}</small>
                </td>
                <td class="px-6 py-4">
                  <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <BaseButton color="info" :icon="mdiEye" small @click="isModalActive = true" />
                    <BaseButton
                      color="danger"
                      :icon="mdiTrashCan"
                      small
                      @click="isModalDangerActive = true"
                    />
                  </BaseButtons>
                </td>
              </tr>

              <tr v-else>
                <td colspan="7" class="py-[20px] text-center">No data to show</td>
              </tr>
            </tbody>
          </table>
        </div>

        <template #footer>
          <BaseButtons class="flex justify-end mt-4">
            <BaseButton type="submit" color="success" label="Submit" small />
            <BaseButton type="reset" color="danger" outline label="Reset" small />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>

    <SectionTitle>Custom elements</SectionTitle>

    <SectionMain>
      <CardBox>
        <FormField label="Checkbox">
          <FormCheckRadioGroup
            v-model="customElementsForm.checkbox"
            name="sample-checkbox"
            :options="{ lorem: 'Lorem', ipsum: 'Ipsum', dolore: 'Dolore' }"
          />
        </FormField>

        <BaseDivider />

        <FormField label="Radio">
          <FormCheckRadioGroup
            v-model="customElementsForm.radio"
            name="sample-radio"
            type="radio"
            :options="{ one: 'One', two: 'Two' }"
          />
        </FormField>

        <BaseDivider />

        <FormField label="Switch">
          <FormCheckRadioGroup
            v-model="customElementsForm.switch"
            name="sample-switch"
            type="switch"
            :options="{ one: 'One', two: 'Two' }"
          />
        </FormField>

        <BaseDivider />

        <FormFilePicker v-model="customElementsForm.file" label="Upload" />
      </CardBox>

      <SectionTitle>Form with status example</SectionTitle>

      <CardBox
        class="md:w-7/12 lg:w-5/12 xl:w-4/12 shadow-2xl md:mx-auto"
        is-form
        is-hoverable
        @submit.prevent="formStatusSubmit"
      >
        <NotificationBarInCard
          :color="formStatusOptions[formStatusCurrent]"
          :is-placed-with-header="formStatusWithHeader"
        >
          <span
            ><b class="capitalize">{{ formStatusOptions[formStatusCurrent] }}</b> state</span
          >
        </NotificationBarInCard>
        <FormField label="Fields">
          <FormControl
            v-model="form.name"
            :icon-left="mdiAccount"
            help="Your full name"
            placeholder="Name"
          />
        </FormField>

        <template #footer>
          <BaseButton label="Trigger" type="submit" color="info" small />
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
