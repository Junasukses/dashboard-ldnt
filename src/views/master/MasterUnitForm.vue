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
import FormCheckRadio from '@/components/FormCheckRadio.vue'
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
const token = ref(
  localStorage.getItem('authToken')
)
const endpointApi = 'm_unit'

const mainStore = useMainStore()
const apiTable = ref()
const actionText = ref(route.params.id === 'create' ? 'Create' : route.query.action)
const formErrors = reactive({})
const values = reactive({

});

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Satuan Barang" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField>
          <div class="grid grid-cols-2 gap-8">
            <div>
            <label class="block font-bold mb-2">Business Unit</label>
            <FieldX
              :bind="{ readonly: true }"
              class="w-full !mt-0"
              :value="values['m_bu.code']"
              :errorText="formErrors.m_bu_id ? 'failed' : ''"
              :check="false"
              placeholder=""
            />
          </div>
          <div>
            <label class="block font-bold mb-2">Kode</label>
            <FieldX
              :bind="{ readonly: true }"
              class="w-full !mt-0"
              :value="values['code']"
              :errorText="formErrors.code ? 'failed' : ''"
              :check="false"
              placeholder=""
            />
          </div>
          <div>
            <label class="block font-bold mb-2">Nama</label>
            <FieldX
              :bind="{ readonly: false }"
              class="w-full !mt-0"
              :value="values['name']"
              :errorText="formErrors.name ? 'failed' : ''"
              :check="false"
              placeholder=""
            />
          </div>
          <div>
            <label class="block font-bold mb-2">Deskripsi</label>
            <FieldX
              :bind="{ readonly: false }"
              class="w-full !mt-0"
              :value="values['name']"
              :errorText="formErrors.name ? 'failed' : ''"
              :check="false"
              type="textarea"
              placeholder=""
            />
          </div>
          <FormField label="Status">
          <FormCheckRadio
            v-model="values.is_active"
            type="switch"
            :options="{ true: 1, false: 0 }"
          />
          <div>{{ values.is_active }}</div>
        </FormField>
        </div>
        </FormField>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
