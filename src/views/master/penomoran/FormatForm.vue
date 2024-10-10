<script setup>
import { reactive, ref } from 'vue'
import { mdiBallotOutline, mdiTrashCan, mdiArrowUp, mdiArrowDown } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { useRouter, useRoute } from 'vue-router'
import { onBeforeMount } from 'vue'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const baseUrl = ref(import.meta.env.VITE_API_URL)
const token = ref(localStorage.getItem('token') ?? import.meta.env.VITE_AUTH_TOKEN)
const endpointApi = 'generate_code'
const landing_path = '/setting-penomoran?activeTab=1'

const detailArr = ref([])
const actionText = ref(route.params.id === 'create' ? 'Create' : route.query.action)
const formErrors = reactive({})
const values = reactive({
  is_active: 1
})

onBeforeMount(async () => {
  if (actionText.value === 'Create') return
  try {
    const res = await axios.get(`${baseUrl.value}/operation/${endpointApi}/${route.params.id}`)

    if (res.status !== 200) throw new Error('Failed when trying to read data')
    const resData = res.data
    for (const [key, value] of Object.entries(resData.data)) {
      values[key] = value
    }
    detailArr.value = values.generate_code_d
    values.is_active = values.is_active ? 1 : 0
  } catch (err) {
    alertify.error('Failed to get data')
    router.replace(landing_path)
  }
})

async function onSave() {
  try {
    const hit_endpoint = `${baseUrl.value}/operation/${endpointApi}/${actionText.value === 'Edit' ? route.params.id : ''}`
    values.generate_code_d = detailArr.value.map((dt, key) => ({ ...dt, seq: key + 1 }))
    const res = await axios({
      method: actionText.value === 'Edit' ? 'PUT' : 'POST',
      url: hit_endpoint,
      data: values,
      headers: { 'Content-Type': 'Application/json', authorization: `Bearer ${token.value}` }
    })

    if (res.status === 200) {
      router.replace(landing_path)
    }
  } catch (e) {
    for (const [key, value] of Object.entries(e.response.data.errors)) {
      formErrors[key] = value
    }
    alertify.error(e.response.data.message)
  } finally {
  }
}
const addRow = () => {
  const newItem = {}
  detailArr.value.push(newItem)
}

const delAllRow = () => {
  alertify.confirm(
    'Perhatian',
    `Hapus semua detail susunan?`,
    () => {
      detailArr.value = []
    },
    () => {}
  )
}

const delRow = (key) => {
  alertify.confirm(
    'Perhatian',
    `Hapus baris ini?`,
    () => {
      detailArr.value = detailArr.value.filter((dt, i) => key !== i)
    },
    () => {}
  )
}

const upRow = (key) => {
  const current = detailArr.value[key]
  detailArr.value[key] = detailArr.value[key - 1]
  detailArr.value[key - 1] = current
}

const downRow = (key) => {
  const current = detailArr.value[key]
  detailArr.value[key] = detailArr.value[key + 1]
  detailArr.value[key + 1] = current
}

async function pratinjau() {
  const dataURL = `${baseUrl.value}/operation/${endpointApi}/tes_nomor`
  values.detail = detailArr.value
  try {
    const res = await fetch(dataURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/json',
        Authorization: `Bearer ${token.value}`
      },
      body: JSON.stringify(values)
    })
    const responseJson = await res.json()
    if (responseJson.code !== 200) {
      alertify.error(responseJson.message)
    }

    if (responseJson.code === 404) {
      router.replace(landing_path)
    }
    values.pratinjau = responseJson.data ?? ''
  } catch (err) {
    alertify.error('Failed to pratinjau data')
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Setting Format Penomoran" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block font-semibold mb-2">Menu</label>
            <FieldSelect
              :bind="{ disabled: !actionText, clearable: true }"
              class="w-full !mt-0"
              :value="values.m_menu_id"
              @input="(v) => (values.m_menu_id = v)"
              label=""
              :errorText="formErrors.m_menu_id ? 'failed' : ''"
              :hints="formErrors.m_menu_id"
              valueField="id"
              displayField="menu"
              :api="{
                url: `${baseUrl}/operation/m_menu`,
                headers: {
                  'Content-Type': 'Application/json',
                  Authorization: `Bearer ${token}`
                },
                params: {
                  simplest: true,
                  transform: false,
                  join: false
                }
              }"
              placeholder="Masukkan Menu"
              :check="false"
            />
          </div>
          <div>
            <label class="block font-semibold mb-2">Identifier</label>
            <FieldX
              :bind="{ readonly: !actionText }"
              class="w-full !mt-0"
              :value="values.identifier"
              :errorText="formErrors.identifier ? 'failed' : ''"
              @input="(v) => (values.identifier = v)"
              :hints="formErrors.identifier"
              placeholder="Masukkan Identifier"
              :check="false"
              label=""
            />
          </div>
          <div>
            <label class="block font-semibold mb-2">Status</label>
            <FieldSelect
              :bind="{ disabled: !actionText, clearable: true }"
              class="w-full !mt-0"
              :value="values.is_active"
              @input="(v) => (values.is_active = v)"
              :errorText="formErrors.is_active ? 'failed' : ''"
              :hints="formErrors.is_active"
              valueField="id"
              displayField="key"
              :options="[
                { id: 1, key: 'Active' },
                { id: 0, key: 'InActive' }
              ]"
              :check="false"
              placeholder="Masukkan Status"
              label=""
            />
          </div>
          <div>
            <label class="block font-semibold mb-2">Pritinjau</label>
            <FieldX
              :bind="{ readonly: true }"
              class="w-full !mt-0"
              :value="values.pratinjau"
              :errorText="formErrors.pratinjau ? 'failed' : ''"
              :check="false"
              placeholder="Pratinjau"
              label=""
            />
          </div>
        </div>
        <div class="mt-4 flex justify-between">
          <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Format Penomoran Detail">
            <div class="flex my-auto h-6 w-0.5 bg-gray-900 mx-3"></div>
          </SectionTitleLineWithButton>
          <BaseButtons class="flex justify-end">
            <BaseButton @click="pratinjau" type="button" color="warning" label="Pratinjau" small />
            <BaseButton
              v-show="actionText"
              @click="addRow"
              type="button"
              color="info"
              label="Tambah Baris"
              small
            />
            <BaseButton
              v-show="actionText"
              @click="delAllRow"
              type="button"
              color="danger"
              label="Hapus Semua"
              small
            />
          </BaseButtons>
        </div>

        <div class="relative">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3 w-[5%]">No</th>
                <th scope="col" class="px-6 py-3">Prefix</th>
                <th scope="col" class="px-6 py-3">Prefix Value</th>
                <th scope="col" class="px-6 py-3 w-[10%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="detailArr.length > 0"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                v-for="(item, i) in detailArr.sort((a, b) => a.seq - b.seq)"
                :key="item.id"
              >
                <td class="px-6 py-4">
                  {{ i + 1 }}
                </td>
                <td class="px-6 py-4">
                  <FieldSelect
                    :bind="{ disabled: false, clearable: true }"
                    class="w-full !mt-0"
                    :value="item.generate_code_type_id"
                    @input="(v) => (item.generate_code_type_id = v)"
                    :errorText="formErrors.generate_code_type_id ? 'failed' : ''"
                    :hints="formErrors.generate_code_type_id"
                    valueField="id"
                    displayField="name"
                    :api="{
                      url: `${baseUrl}/operation/generate_code_type`,
                      headers: {
                        'Content-Type': 'Application/json',
                        Authorization: `Bearer ${token}`
                      }
                    }"
                    @update:valueFull="
                      (v) => {
                        item.generate_code_type_v = v.id
                      }
                    "
                    placeholder="Masukan Prefix"
                    label=""
                    :check="false"
                  />
                </td>
                <td class="px-6 py-4">
                  <FieldSelect
                    :bind="{ disabled: true, clearable: true }"
                    class="w-full !mt-0"
                    :value="item.generate_code_type_id"
                    :errorText="formErrors.generate_code_type ? 'failed' : ''"
                    :hints="formErrors.generate_code_type"
                    valueField="id"
                    displayField="value"
                    :api="{
                      url: `${baseUrl}/operation/generate_code_type`,
                      headers: {
                        'Content-Type': 'Application/json',
                        Authorization: `Bearer ${token}`
                      }
                    }"
                    @update:valueFull="
                      (v) => {
                        item.generate_code_type = v.value
                      }
                    "
                    placeholder="Masukan Prefix"
                    label=""
                    :check="false"
                  />
                </td>
                <td class="px-6 py-4">
                  <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <BaseButton
                      v-show="i > 0"
                      @click="upRow(i)"
                      color="info"
                      :icon="mdiArrowUp"
                      small
                    />
                    <BaseButton
                      @click="downRow(i)"
                      v-show="i < detailArr.length - 1"
                      color="info"
                      :icon="mdiArrowDown"
                      small
                    />
                    <BaseButton @click="delRow(i)" color="danger" :icon="mdiTrashCan" small />
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
            <BaseButton
              @click="router.replace(landing_path)"
              type="reset"
              color="danger"
              label="Kembali"
            />
            <BaseButton
              v-show="actionText"
              @click="onSave"
              type="submit"
              color="success"
              label="Simpan"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
