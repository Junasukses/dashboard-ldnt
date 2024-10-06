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
const endpointApi = 'm_unit'
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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Satuan" main>
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
