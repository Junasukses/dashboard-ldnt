<script setup>
import { reactive, ref } from 'vue'
import { mdiBallotOutline, mdiAccount, mdiMail, mdiGithub } from '@mdi/js'
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
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'
import { useRoute } from 'vue-router'

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

const apiTable = ref()
const actionText = ref(route.params.id === 'create' ? 'Tambah' : route.query.action)
const formErrors = ref({})
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

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Forms example" main>
        <BaseButton
          href="https://github.com/justboil/admin-one-vue-tailwind"
          target="_blank"
          :icon="mdiGithub"
          label="Star on GitHub"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>
      <CardBox form @submit.prevent="submit">
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
          <div class="col-span-2">
            <label class="block font-bold mb-2">With help line</label>
            <FormControl v-model="form.phone" type="tel" placeholder="Your phone number" />
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
        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit" small />
            <BaseButton type="reset" color="info" outline label="Reset" small />
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
