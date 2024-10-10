<script setup>
import { reactive, ref, onMounted } from 'vue'
import { mdiBallotOutline, mdiPlus, mdiTrashCan } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { useRoute, useRouter } from 'vue-router'
import BaseIcon from '@/components/BaseIcon.vue'
import { useStore } from '@/stores/app'
import FormCheckRadioGroup from '@/components/FormCheckRadioGroup.vue'
import BaseButton from '@/components/BaseButton.vue'
import ButtonMultiSelect from '@/components/forms/ButtonMultiSelect.vue'
import FieldPopupBarang from '@/components/FieldPopupBarang.vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const token = ref(localStorage.getItem('token') ?? import.meta.env.VITE_AUTH_TOKEN)
const endpointApi = 'm_role'
let initialValues = {}
const store = useStore()

const modulPath = route.path.split('/')[1]
const isRead = route.params.id && route.params.id !== 'create'
const actionText = ref(route.params.id === 'create' ? 'Create' : route.query.action)
const formErrors = ref({})
const data = reactive({
  is_active: true
})

const detailArr = ref([])

function onDetailAdd(rows) {
  const data = [...detailArr.value]
  rows.forEach((row) => {
    row.seq = detailArr.value.length + 1
    row['m_menu_id'] = row.id
    row['m_menu.modul'] = row.modul
    row['m_menu.submodul'] = row.submodul
    row['m_menu.menu'] = row.menu
    row['m_menu.path'] = row.path
    row.c_read = true
    row.c_show = true
    row.c_create = true
    row.c_update = true
    row.c_delete = true
    row.c_print = true
    data.push(row)
  })
  detailArr.value = data
}

const removeDetail = (index) => {
  detailArr.value.splice(index, 1)
  updateSequence()
}

const updateSequence = () => {
  detailArr.value.forEach((item, index) => {
    item.seq = index + 1
  })
}

function onBack() {
  router.replace('/' + modulPath)
  return
}
onMounted(async () => {
  if (isRead) {
    try {
      store.setRequesting(true)

      const editedId = route.params.id
      const response = await axios.get(`/operation/${endpointApi}/${editedId}`)

      if (response.status !== 200) throw new Error('Failed when trying to read data')
      initialValues = response.data.data
      initialValues.m_role_d?.forEach((items) => {
        detailArr.value = [items, ...detailArr.value]
      })
    } catch (err) {
      const errorMessage = err.response?.data || 'Failed to get data.'
      alertify.error(errorMessage)
    }
  }
  for (const key in initialValues) {
    data[key] = initialValues[key]
  }

  store.setRequesting(false)
})

const onSave = async () => {
  try {
    store.setRequesting(true)
    const isCreating = ['Create', 'Copy', 'Tambah'].includes(actionText.value)
    data.m_role_d = detailArr.value?.map((item) => ({
      ...item,
      c_read: item.c_read ? 1 : 0,
      c_show: item.c_show ? 1 : 0,
      c_create: item.c_create ? 1 : 0,
      c_update: item.c_update ? 1 : 0,
      c_delete: item.c_delete ? 1 : 0,
      c_print: item.c_print ? 1 : 0
    }))
    const response = await axios({
      method: isCreating ? 'POST' : 'PUT',
      url: `/operation/${endpointApi}${isCreating ? '' : '/' + route.params.id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: {
        ...data,
        is_active: data.is_active ? '1' : '0'
      }
    })
    alertify.success(response.data.message)
    formErrors.value = {}
    router.replace('/' + modulPath + '?reload=' + Date.parse(new Date()))
  } catch (err) {
    const { response } = err
    const errorMessage =
      response?.data?.errors?.[0] ||
      response?.data?.message ||
      'Oops, sesuatu yang salah terjadi. Coba kembali nanti.'

    formErrors.value = response?.data?.errors || {}
    alertify.error(errorMessage)
  }
  store.setRequesting(false)
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Role" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField>
          <div class="grid grid-cols-3 gap-8">
            <div class="">
              <label class="block font-bold mb-2 mr-4 w-[40%]">Code</label>
              <FieldX
                :bind="{ readonly: true, clearable: false }"
                :value="data.code"
                @input="(v) => (data.code = v)"
                :check="false"
                placeholder="Autogenerate By System"
                label=""
                class="!mt-0"
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Name</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.name"
                @input="(v) => (data.name = v)"
                :hints="formErrors.name"
                :errorText="formErrors.name ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Nama"
                label=""
              />
            </div>
            <div class="relative">
              <div class="absolute top-0 w-full left-0">
                <label class="block font-bold mb-2">Deskripsi</label>
                <FieldX
                  :bind="{ readonly: !actionText }"
                  class="w-full !mt-0"
                  :value="data.desc"
                  @input="(v) => (data.desc = v)"
                  :hints="formErrors.desc"
                  :errorText="formErrors.desc ? 'failed' : ''"
                  :check="false"
                  placeholder="Masukan Deskripsi"
                  type="textarea"
                  label=""
                />
              </div>
            </div>

            <div>
              <label class="block font-bold mb-2" for="status">Status</label>
              <FormCheckRadio
                v-model="data.is_active"
                name="status"
                :label="data.is_active ? 'Active' : 'Inactive'"
                type="switch"
                :is-disabled="!actionText"
                :input-value="true"
              />
            </div>
          </div>
        </FormField>
        <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Diskon Detail">
          <div class="flex my-auto h-6 w-0.5 bg-gray-900 mx-3"></div>
          <ButtonMultiSelect
            title="Add To List"
            @add="onDetailAdd"
            :api="{
              url: `${store.server}/operation/m_menu`,
              headers: {
                'Content-Type': 'Application/json',
                Authorization: `Bearer ${token}`
              },
              params: {
                simplest: true,
                where: `this.is_active = true`,
                searchfield: 'this.menu, this.submodul, this.menu,this.path',
                notin:
                  detailArr.length > 0
                    ? `this.id:${detailArr
                        .map((dt) => dt.m_menu_id)
                        ?.filter((m_menu_id) => m_menu_id)
                        ?.join(',')}`
                    : null
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
                field: 'modul',
                headerName: 'Modul',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'submodul',
                headerName: 'Sub Modul',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'menu',
                headerName: 'Menu',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'path',
                headerName: 'URL',
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
        <div
          class="relative mt-8"
          style="-ms-overflow-style: none; scrollbar-width: thin; overflow-x: auto"
        >
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3 w-[5%]">No</th>
                <th scope="col" class="px-6 py-3">Modul</th>
                <th scope="col" class="px-6 py-3">Sub Modul</th>
                <th scope="col" class="px-6 py-3">Menu</th>
                <th scope="col" class="px-6 py-3">Path</th>
                <th scope="col" class="px-6 py-3 w-[5%]">Read</th>
                <th scope="col" class="px-6 py-3 w-[5%]">Show</th>
                <th scope="col" class="px-6 py-3 w-[5%]">Create</th>
                <th scope="col" class="px-6 py-3 w-[5%]">Update</th>
                <th scope="col" class="px-6 py-3 w-[5%]">Delete</th>
                <th scope="col" class="px-6 py-3 w-[5%]">Print</th>
                <th scope="col" class="px-6 py-3 w-[5%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="detailArr.length > 0"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-xs"
                v-for="(item, i) in detailArr"
                :key="i"
              >
                <td class="px-6 py-4">
                  {{ i + 1 }}
                </td>
                <td class="px-6 py-4">
                  {{ item['m_menu.modul'] }}
                </td>
                <td class="px-6 py-4">
                  {{ item['m_menu.submodul'] }}
                </td>
                <td class="px-6 py-4">
                  {{ item['m_menu.menu'] }}
                </td>
                <td class="px-6 py-4">
                  {{ item['m_menu.path'] }}
                </td>
                <td class="px-6 py-4">
                  <FormCheckRadio
                    v-model="item.c_read"
                    name="Full"
                    label=""
                    type="switch"
                    :is-disabled="!actionText"
                    :input-value="true"
                  />
                </td>
                <td class="px-6 py-4">
                  <FormCheckRadio
                    v-model="item.c_show"
                    name="Full"
                    label=""
                    type="switch"
                    :is-disabled="!actionText"
                    :input-value="true"
                  />
                </td>
                <td class="px-6 py-4">
                  <FormCheckRadio
                    v-model="item.c_create"
                    name="Full"
                    label=""
                    type="switch"
                    :is-disabled="!actionText"
                    :input-value="true"
                  />
                </td>
                <td class="px-6 py-4">
                  <FormCheckRadio
                    v-model="item.c_update"
                    name="Full"
                    label=""
                    type="switch"
                    :is-disabled="!actionText"
                    :input-value="true"
                  />
                </td>
                <td class="px-6 py-4">
                  <FormCheckRadio
                    v-model="item.c_delete"
                    name="Full"
                    label=""
                    type="switch"
                    :is-disabled="!actionText"
                    :input-value="true"
                  />
                </td>
                <td class="px-6 py-4">
                  <FormCheckRadio
                    v-model="item.c_print"
                    name="Full"
                    label=""
                    type="switch"
                    :is-disabled="!actionText"
                    :input-value="true"
                  />
                </td>
                <td class="px-6 py-4">
                  <BaseButton color="danger" :icon="mdiTrashCan" small @click="removeDetail(i)" />
                </td>
              </tr>

              <tr v-else>
                <td :colspan="activeTabIndex === 2 ? '5' : '9'" class="py-[20px] text-center">
                  No data to show
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-4">
            <BaseButton label="Kembali" type="button" color="danger" small @click="onBack" />
            <BaseButton label="Simpan" type="button" color="success" small @click="onSave" />
          </div>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
