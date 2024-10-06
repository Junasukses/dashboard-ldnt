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
const endpointApi = 'm_gen'
let initialValues = {}
const store = useStore()

const modulPath = route.path.split('/')[1]
const isRead = route.params.id && route.params.id !== 'create'
const actionText = ref(route.params.id === 'create' ? 'Create' : route.query.action)
const formErrors = ref({})
const data = reactive({
  is_active: true,
  all_bu: true
})
const detailArr = ref([])

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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="General" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField>
          <div class="grid grid-cols-3 gap-8">
            <div>
              <label class="block font-bold mb-2">Business Unit</label>
              <FieldSelect
                :bind="{ disabled: !actionText, clearable: false }"
                class="w-full !mt-0"
                :value="data.m_bu_id"
                @input="(v) => (data.m_bu_id = v)"
                :hints="formErrors.m_bu_id"
                :errorText="formErrors.m_bu_id ? 'failed' : ''"
                :check="false"
                placeholder="Pilih Business Unit"
                valueField="id"
                displayField="name"
                :api="{
                  url: `${store.server}/operation/m_bu`,
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
            <div class="">
              <label class="block font-bold mb-2 mr-4 w-[40%]">Group</label>
              <FieldX
                :bind="{ readonly: !actionText, clearable: false }"
                :value="data.group"
                @input="(v) => (data.group = v)"
                :hints="formErrors.group"
                :errorText="formErrors.group ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Group"
                label=""
                class="!mt-0"
              />
            </div>
            <div class="">
              <label class="block font-bold mb-2 mr-4 w-[40%]">Code</label>
              <FieldX
                :bind="{ readonly: !actionText, clearable: false }"
                :value="data.code"
                @input="(v) => (data.code = v)"
                :hints="formErrors.code"
                :errorText="formErrors.code ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Code"
                label=""
                class="!mt-0"
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Key 1</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.key1"
                @input="(v) => (data.key1 = v)"
                :hints="formErrors.key1"
                :errorText="formErrors.key1 ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Key 1"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Key 2</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.key2"
                @input="(v) => (data.key2 = v)"
                :hints="formErrors.key2"
                :errorText="formErrors.key2 ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Key 2"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Key 3</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.key3"
                @input="(v) => (data.key3 = v)"
                :hints="formErrors.key3"
                :errorText="formErrors.key3 ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Key 3"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Key 4</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.key4"
                @input="(v) => (data.key4 = v)"
                :hints="formErrors.key4"
                :errorText="formErrors.key4 ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Key 4"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">value 1</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.value1"
                @input="(v) => (data.value1 = v)"
                :hints="formErrors.value1"
                :errorText="formErrors.value1 ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Value 1"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">value 2</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.value2"
                @input="(v) => (data.value2 = v)"
                :hints="formErrors.value2"
                :errorText="formErrors.value2 ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Value 2"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">value 3</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.value3"
                @input="(v) => (data.value3 = v)"
                :hints="formErrors.value3"
                :errorText="formErrors.value3 ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Value 3"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">value 4</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.value4"
                @input="(v) => (data.value4 = v)"
                :hints="formErrors.value4"
                :errorText="formErrors.value4 ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Value 4"
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
              <label class="block font-bold mb-2" for="all_bu">Semua Business Unit</label>
              <FormCheckRadio
                v-model="data.all_bu"
                name="all_bu"
                :label="data.all_bu ? 'Iya' : 'Tidak'"
                type="switch"
                :is-disabled="!actionText"
                :input-value="true"
              />
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
