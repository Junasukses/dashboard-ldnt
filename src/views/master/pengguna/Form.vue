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
const endpointApi = 'default_users'
let initialValues = {}
const store = useStore()

const modulPath = route.path.split('/')[1]
const isRead = route.params.id && route.params.id !== 'create'
const actionText = ref(route.params.id === 'create' ? 'Create' : route.query.action)
const formErrors = ref({})
const data = reactive({
  is_active: true,
  type: 'ADMIN'
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

const isValidEmail = ref(true)
function validateEmail(v) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)) {
    formErrors.value['email'] = null
    isValidEmail.value = true
  } else {
    formErrors.value['email'] = ['Please enter a valid email address']
    isValidEmail.value = false
  }
  data.email = v
}

const isValidPassword = ref(true)
function validatePassword(v) {
  if (v.length >= 5) {
    formErrors.value['password'] = null
    isValidPassword.value = true
  } else {
    formErrors.value['password'] = ['Password Minimal 5 Characters']
    isValidPassword.value = false
  }
  data.password = v
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
            <div>
              <label class="block font-bold mb-2">Username</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.username"
                @input="(v) => (data.username = v?.toLowerCase())"
                :hints="formErrors.username"
                :errorText="formErrors.username ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Username"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Email</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.email"
                @input="(v) => validateEmail(v)"
                :hints="formErrors.email"
                :errorText="formErrors.email ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Email"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Password</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.password"
                @input="(v) => validatePassword(v)"
                :hints="formErrors.password"
                :errorText="formErrors.password ? 'failed' : ''"
                :check="false"
                type="password"
                placeholder="Masukan Password"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Type</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.type"
                @input="(v) => (data.type = v)"
                :hints="formErrors.type"
                :errorText="formErrors.type ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Type"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Field Upload</label>
              <FieldUpload
                :value="data.profile_image"
                @input="(v) => (data.profile_image = v)"
                :errorText="formErrors.profile_image ? 'failed' : ''"
                :hints="formErrors.profile_image"
                :maxSize="10"
                :reducerDisplay="
                  (val) => (!val ? null : val.split(':::')[val.split(':::').length - 1])
                "
                :api="{
                  url: `${store.server}/operation/${endpointApi}/upload`,
                  headers: { Authorization: `Bearer ${token}` },
                  params: { field: 'profile_image' },
                  onsuccess: (response) => response,
                  onerror: (error) => {
                    console.log(error)
                  }
                }"
                placeholder="Pilih File"
                fa-icon="upload"
                accept=".png,.jpg"
                :check="false"
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
