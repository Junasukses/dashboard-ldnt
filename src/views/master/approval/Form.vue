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
const endpointApi = 'm_approval'
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
let _id = 0

const addDetail = () => {
  const lastItem = detailArr.value.at(-1)
  const newLevel = lastItem ? lastItem.level + 1 : ++_id

  const tempItem = {
    level: newLevel,
    type: newLevel === 1 ? 'MENGAJUKAN' : null,
    is_full: false,
    is_skip: false
  }

  detailArr.value.push(tempItem)
}

const removeDetail = (index) => {
  detailArr.value.splice(index, 1)
  detailArr.value.forEach((item, idx) => {
    item.level = idx + 1
  })

  if (!detailArr.value.length) _id = 0
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
      initialValues.m_approval_d?.forEach((items) => {
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
    data.m_approval_d = detailArr.value?.map((item) => ({
      ...item,
      is_full: item.is_full ? 1 : 0,
      is_skip: item.is_skip ? 1 : 0
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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Approval" main>
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
              <label class="block font-bold mb-2">Menu</label>
              <FieldSelect
                :bind="{ disabled: !actionText, clearable: false }"
                class="w-full !mt-0"
                :value="data.m_menu_id"
                @input="(v) => (data.m_menu_id = v)"
                :hints="formErrors.m_menu_id"
                :errorText="formErrors.m_menu_id ? 'failed' : ''"
                :check="false"
                placeholder="Pilih Menu"
                valueField="id"
                displayField="menu"
                :api="{
                  url: `${store.server}/operation/m_menu`,
                  headers: {
                    'Content-Type': 'Application/json',
                    Authorization: `Bearer ${token}`
                  },
                  params: {
                    where: `this.is_active='true'`
                  }
                }"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Identifier</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.identifier"
                @input="(v) => (data.identifier = v)"
                :hints="formErrors.identifier"
                :errorText="formErrors.identifier ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Identifier"
                label=""
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
                <label class="block font-bold mb-2">Catatan</label>
                <FieldX
                  :bind="{ readonly: !actionText }"
                  class="w-full !mt-0"
                  :value="data.note"
                  @input="(v) => (data.note = v)"
                  :hints="formErrors.note"
                  :errorText="formErrors.note ? 'failed' : ''"
                  :check="false"
                  placeholder="Masukan Catatan"
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
        <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Approval Detail">
          <div class="flex my-auto h-6 w-0.5 bg-gray-900 mx-3"></div>
          <BaseButton
            color="info"
            label="Add To List"
            small
            :icon="mdiPlus"
            :disabled="!actionText"
            @click="addDetail"
          />
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
                <th scope="col" class="px-6 py-3 w-[5%]">Level</th>
                <th scope="col" class="px-6 py-3">Type</th>
                <th scope="col" class="px-6 py-3">Role</th>
                <th scope="col" class="px-6 py-3">User</th>
                <th scope="col" class="px-6 py-3 w-[5%]">Full</th>
                <th scope="col" class="px-6 py-3 w-[5%]">Skip</th>
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
                  <FieldNumber
                    :bind="{ readonly: !actionText || i == 0, clearable: false }"
                    class="w-full !mt-0"
                    :value="item.level"
                    @input="(v) => (item.level = v)"
                    placeholder=""
                    label=""
                    :check="false"
                  />
                </td>

                <td class="px-6 py-4">
                  <FieldSelect
                    :bind="{ disabled: !actionText || i == 0, clearable: false }"
                    class="!mt-0"
                    :value="item.type"
                    @input="(v) => (item.type = v)"
                    :options="['MENGAJUKAN', 'MENYETUJUI']"
                    placeholder=""
                    label=""
                    :check="false"
                  />
                </td>
                <td class="px-6 py-4">
                  <FieldSelect
                    :bind="{ disabled: !actionText, clearable: false }"
                    class="!mt-0"
                    :value="item.m_role_id"
                    @input="(v) => (item.m_role_id = v)"
                    valueField="id"
                    displayField="name"
                    :api="{
                      url: `${store.server}/operation/m_role`,
                      headers: {
                        'Content-Type': 'Application/json',
                        Authorization: `Bearer ${token}`
                      },
                      params: {
                        where: `this.is_active='true'`,
                        simplest: true
                      }
                    }"
                    placeholder=""
                    label=""
                    :check="false"
                  />
                </td>
                <td class="px-6 py-4">
                  <FieldSelect
                    :bind="{ disabled: !actionText, clearable: false }"
                    class="!mt-0"
                    :value="item.default_user_id"
                    @input="(v) => (item.default_user_id = v)"
                    valueField="id"
                    displayField="name"
                    :api="{
                      url: `${store.server}/operation/default_users`,
                      headers: {
                        'Content-Type': 'Application/json',
                        Authorization: `Bearer ${token}`
                      },
                      params: {
                        where: `this.is_active='true'`
                      }
                    }"
                    placeholder=""
                    label=""
                    :check="false"
                  />
                </td>
                <td class="px-6 py-4">
                  <FormCheckRadio
                    v-model="item.is_full"
                    name="Full"
                    :label="item.is_full ? 'Iya' : 'Tidak'"
                    type="checkbox"
                    :is-disabled="!actionText"
                    :input-value="true"
                  />
                </td>
                <td class="px-6 py-4">
                  <FormCheckRadio
                    v-model="item.is_skip"
                    name="Skip"
                    :label="item.is_skip ? 'Iya' : 'Tidak'"
                    type="checkbox"
                    :is-disabled="!actionText"
                    :input-value="true"
                  />
                </td>
                <td class="px-6 py-4">
                  <BaseButton
                    color="danger"
                    :icon="mdiTrashCan"
                    small
                    @click="removeDetail(i) || i == 0"
                  />
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
