<script setup>
import { reactive, ref, onMounted } from 'vue'
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
import FormField from '@/components/FormField.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'
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
const endpointApi = 't_disc'
const activeTabIndex = ref(0)
let initialValues = {}
const store = useStore()

const modulPath = route.path.split('/')[1]
const isRead = route.params.id && route.params.id !== 'create'
const actionText = ref(route.params.id === 'create' ? 'Create' : route.query.action)
const formErrors = ref({})
const data = reactive({
  payment_type: 'ALL',
  discount_type: route.query.type
})
const detailArr = ref([])
let seq_ = 0

const addDetail = () => {
  const tempItem = {
    seq: detailArr.value.length + 1,
    type: data.discount_type !== 'GLOBAL' ? 'ITEM' : null
  }
  detailArr.value = [...detailArr.value, tempItem]
}

const addDetailProgresif = () => {
  const firstItem = detailArr.value.length ? detailArr.value[0] : null
  const tempItem = {
    seq: detailArr.value.length + 1,
    type: data.discount_type !== 'GLOBAL' ? 'ITEM' : null,
    m_item_id: firstItem ? firstItem.m_item_id : null,
    'm_item.item_name': firstItem ? firstItem['m_item.item_name'] : null,
    m_unit_id: firstItem ? firstItem.m_unit_id : null,
    'm_unit.name': firstItem ? firstItem['m_unit.name'] : null,
    disc_type: firstItem ? firstItem.disc_type : null
  }
  detailArr.value = [...detailArr.value, tempItem]
}

function onDetailAdd(rows) {
  Object.assign(rows, {
    seq: detailArr.value.length + 1,
    type: data.discount_type !== 'GLOBAL' ? 'ITEM' : null
  })
  detailArr.value = [...detailArr.value, rows]
}

function onDetailAddReguler(rows) {
  const data = [...detailArr.value]
  rows.forEach((row) => {
    row.seq = detailArr.value?.length + 1
    row.type = data.discount_type !== 'GLOBAL' ? 'ITEM' : null
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

      initialValues.t_disc_d
        ?.sort((a, b) => a.id - b.id)
        .forEach((items) => {
          detailArr.value = [items, ...detailArr.value]
        })
    } catch (err) {
      const errorMessage = err.response?.data || 'Failed to get data.'
      alertify.error(errorMessage)
    }
  }
  console.log(initialValues)
  for (const key in initialValues) {
    console.log(key)
    data[key] = initialValues[key]
  }

  store.setRequesting(false)
})

const onSave = async () => {
  try {
    store.setRequesting(true)
    const isCreating = ['Create', 'Copy', 'Tambah'].includes(actionText.value)
    data.t_disc_d = detailArr.value
    const response = await axios({
      method: isCreating ? 'POST' : 'PUT',
      url: `/operation/${endpointApi}${isCreating ? '' : '/' + route.params.id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: data
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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Diskon" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField>
          <div class="grid grid-cols-3 gap-8">
            <div class="">
              <label class="block font-bold mb-2 mr-4 w-[40%]">Discount Type :</label>
              <FieldSelect
                :bind="{ disabled: true, clearable: false }"
                :value="data.discount_type"
                @input="(v) => (data.discount_type = v)"
                :check="false"
                :options="['REGULER', 'PROGRESIF', 'GLOBAL']"
                placeholder="Pilih Discount Type"
                label=""
                class="!mt-0"
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Business Unit</label>
              <FieldSelect
                :bind="{ disabled: !actionText, clearable: false }"
                :value="data.m_bu_id"
                @input="(v) => (data.m_bu_id = v)"
                :errorText="formErrors.m_bu_id ? 'failed' : ''"
                :hints="formErrors.m_bu_id"
                :check="false"
                valueField="id"
                displayField="name"
                :api="{
                  url: `${store.server}/operation/m_bu`,
                  headers: {
                    'Content-Type': 'Application/json',
                    Authorization: `Bearer ${token}`
                  },
                  params: {
                    simplest: true
                  }
                }"
                placeholder="Pilih Bu"
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
                placeholder="Masukan Nama Discount"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Payment Type</label>
              <FieldSelect
                :bind="{ disabled: !actionText, clearable: false }"
                :value="data.payment_type"
                :errorText="formErrors.payment_type ? 'failed' : ''"
                :hints="formErrors.payment_type"
                @input="(v) => (data.payment_type = v)"
                :check="false"
                @update:valueFull="
                  (e) => {
                    delete data.m_payment_type_id
                  }
                "
                :options="['ALL', 'CUSTOM']"
                label=""
                placeholder="Pilih Payment Type"
                class="!mt-0"
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Master Payment Type</label>
              <FieldSelect
                :bind="{
                  disabled: !actionText || data.payment_type?.toLowerCase() == 'all',
                  clearable: false
                }"
                :value="data.m_payment_type_id"
                :errorText="formErrors.m_payment_type_id ? 'failed' : ''"
                :hints="formErrors.m_payment_type_id"
                @input="(v) => (data.m_payment_type_id = v)"
                :check="false"
                valueField="id"
                displayField="name"
                :api="{
                  url: `${store.server}/operation/m_payment_type`,
                  headers: {
                    'Content-Type': 'Application/json',
                    Authorization: `Bearer ${token}`
                  },
                  params: {
                    simplest: true
                  }
                }"
                placeholder="Pilih Master Payment Type"
                label=""
                class="!mt-0"
              />
            </div>

            <div>
              <label class="block font-bold mb-2" for="claim_supplier">Claim Supplier</label>
              <FormCheckRadio
                v-model="data.is_claim_supplier"
                name="claim_supplier"
                type="checkbox"
                label="Ya"
                :is-disabled="!actionText"
                :input-value="true"
                @change="delete data.m_supp_id"
              />
            </div>

            <div>
              <label class="block font-bold mb-2">Supplier</label>
              <FieldSelect
                :bind="{
                  disabled: !actionText || !data.is_claim_supplier,
                  clearable: false
                }"
                :value="data.m_supp_id"
                :errorText="formErrors.m_supp_id ? 'failed' : ''"
                :hints="formErrors.m_supp_id"
                @input="(v) => (data.m_supp_id = v)"
                :check="false"
                valueField="id"
                displayField="name"
                :api="{
                  url: `${store.server}/operation/m_payment_type`,
                  headers: {
                    'Content-Type': 'Application/json',
                    Authorization: `Bearer ${token}`
                  },
                  params: {
                    simplest: true
                  }
                }"
                placeholder="Pilih Master Supplier"
                label=""
                class="!mt-0"
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Price</label>
              <FieldNumber
                :bind="{
                  readonly: !actionText || data.discount_type?.toLowerCase() !== 'tebus murah'
                }"
                class="w-full !mt-0"
                :value="data.price_amt"
                @input="(v) => (data.price_amt = v)"
                :hints="formErrors.price_amt"
                :errorText="formErrors.price_amt ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Price Amount"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Min QTY</label>
              <FieldNumber
                :bind="{
                  readonly: !actionText || data.discount_type?.toLowerCase() !== 'tebus murah'
                }"
                class="w-full !mt-0"
                :value="data.min_qty"
                @input="(v) => (data.min_qty = v)"
                :hints="formErrors.min_qty"
                :errorText="formErrors.min_qty ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Min Qty"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Min Amount</label>
              <FieldNumber
                :bind="{
                  readonly: !actionText || data.discount_type?.toLowerCase() !== 'tebus murah'
                }"
                class="w-full !mt-0"
                :value="data.min_amt"
                @input="(v) => (data.min_amt = v)"
                :hints="formErrors.min_amt"
                :errorText="formErrors.min_amt ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Min Amount"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Max Item QTY</label>
              <FieldNumber
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.max_item_qty"
                @input="(v) => (data.max_item_qty = v)"
                :hints="formErrors.max_item_qty"
                :errorText="formErrors.max_item_qty ? 'failed' : ''"
                :check="false"
                placeholder="Masukan Max Item QTY"
                label=""
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Start Date</label>
              <FieldX
                :bind="{ readonly: !actionText, disabled: !actionText }"
                class="w-full !mt-0"
                :value="data.start_date"
                @input="(v) => (data.start_date = v)"
                :hints="formErrors.start_date"
                :errorText="formErrors.start_date ? 'failed' : ''"
                :check="false"
                type="date"
                placeholder="Pilih Start Date"
              />
            </div>
            <div>
              <label class="block font-bold mb-2">End Date</label>
              <FieldX
                :bind="{ readonly: !actionText, disabled: !actionText }"
                class="w-full !mt-0"
                :value="data.end_date"
                @input="(v) => (data.end_date = v)"
                :hints="formErrors.end_date"
                :errorText="formErrors.end_date ? 'failed' : ''"
                :check="false"
                type="date"
                placeholder="Pilih End Date"
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Deskripsi</label>
              <FieldX
                :bind="{ readonly: !actionText }"
                class="w-full !mt-0"
                :value="data.desc"
                @input="(v) => (data.desc = v)"
                :hints="formErrors.desc"
                :errorText="formErrors.desc ? 'failed' : ''"
                :check="false"
                type="textarea"
                placeholder="Masukan Deskripsi"
              />
            </div>
            <div>
              <label class="block font-bold mb-2">Status</label>
              <FieldX
                :bind="{ readonly: true }"
                class="w-full !mt-0"
                :value="data.status"
                @input="(v) => (data.status = v)"
                :hints="formErrors.status"
                :errorText="formErrors.status ? 'failed' : ''"
                :check="false"
                placeholder="Status"
              />
            </div>
          </div>
        </FormField>

        <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Diskon Detail">
          <div class="flex my-auto h-6 w-0.5 bg-gray-900 mx-3"></div>
          <BaseButton
            v-if="data.discount_type == 'GLOBAL'"
            color="info"
            label="Add To List"
            small
            :icon="mdiPlus"
            :disabled="!actionText"
            @click="addDetail"
          />
          <FieldPopupBarang
            v-else-if="data.discount_type == 'PROGRESIF' && detailArr.length < 1"
            ref="barcodeInput"
            :check="false"
            @update:valueFull="
              (e) => {
                onDetailAdd(e)
              }
            "
            valueField="id"
            displayField="barcode"
            :api="{
              url: `${store.server}/operation/v_item_catalog`,
              headers: {
                'Content-Type': 'Application/json',
                Authorization: `Bearer ${token}`
              },
              params: {
                simplest: true,
                searchfield: 'this.item_code,this.item_name,unit,this.barcode,this.supp',
                notin:
                  detailArr.length > 0
                    ? `this.id:${detailArr
                        .map((dt) => dt.m_item_id)
                        ?.filter((m_item_id) => m_item_id)
                        ?.join(',')}`
                    : null
              },
              onsuccess: (response) => {
                response.data = [...response.data].map((dt) => {
                  dt['m_item_id'] = dt['m_item_id']
                  dt['m_item.item_name'] = dt['item_name']
                  dt['m_item_type_id'] = dt['item_type_id']
                  dt['m_item_type.name'] = dt['m_item_type_name']
                  dt['m_unit_id'] = dt['unit_id']
                  dt['m_unit.name'] = dt['unit']
                  dt['price'] = parseFloat(dt['price'] ?? 0)
                  return dt
                })
                response.page = response.current_page
                response.hasNext = response.has_next
                return response
              }
            }"
            :columns="[
              {
                headerName: 'No',
                valueGetter: (p) => p.node.rowIndex + 1,
                width: 60,
                sortable: false,
                resizable: false,
                filter: false,
                cellClass: ['justify-center', 'bg-gray-50']
              },
              {
                flex: 1,
                field: 'item_code',
                headerName: 'Code Item',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'item_name',
                headerName: 'Nama Item',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'barcode',
                headerName: 'Barcode',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'supp',
                headerName: 'Supp',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'unit',
                headerName: 'Unit',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              }
            ]"
            class="!mt-0 !ml-2"
          >
            <BaseButton color="info" label="Add To List" small :icon="mdiPlus" />
          </FieldPopupBarang>

          <ButtonMultiSelect
            v-else-if="data.discount_type == 'REGULER'"
            ref="barcodeInput"
            title="Add To List"
            @add="onDetailAddReguler"
            :api="{
              url: `${store.server}/operation/v_item_catalog`,
              headers: {
                'Content-Type': 'Application/json',
                Authorization: `Bearer ${token}`
              },
              params: {
                simplest: true,
                searchfield: 'this.item_code,this.barcode,this.supp,this.item_name,unit'
              },
              onsuccess: (response) => {
                response.data = [...response.data].map((dt) => {
                  dt['m_item_id'] = dt['m_item_id']
                  dt['m_item.item_name'] = dt['item_name']
                  dt['m_item_type_id'] = dt['item_type_id']
                  dt['m_item_type.name'] = dt['m_item_type_name']
                  dt['m_unit_id'] = dt['unit_id']
                  dt['m_unit.name'] = dt['unit']
                  dt['price'] = parseFloat(dt['price'] ?? 0)
                  return dt
                })
                response.page = response.current_page
                response.hasNext = response.has_next
                response.data = response.data.filter((item) => {
                  return !detailArr.some(
                    (detail) =>
                      detail.m_item_id === item.m_item_id && detail.m_unit_id === item.m_unit_id
                  )
                })
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
                cellClass: ['justify-start', 'bg-gray-50', '!border-gray-200']
              },
              {
                flex: 1,
                field: 'item_code',
                headerName: 'Code Item',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'item_name',
                headerName: 'Nama Item',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'barcode',
                headerName: 'Barcode',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'supp',
                headerName: 'Supp',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              },
              {
                flex: 1,
                field: 'unit',
                headerName: 'Unit',
                sortable: false,
                resizable: true,
                filter: 'ColFilter',
                cellClass: ['border-r', '!border-gray-200', 'justify-center']
              }
            ]"
            class="!mt-0 !ml-2"
          >
            <BaseButton color="info" label="Add To List" small :icon="mdiPlus" />
          </ButtonMultiSelect>
          <BaseButton
            v-else-if="data.discount_type == 'PROGRESIF' && detailArr.length >= 1"
            color="info"
            label="Add To List"
            small
            :icon="mdiPlus"
            :disabled="!actionText"
            @click="addDetailProgresif"
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
                <th scope="col" class="px-6 py-3">Tipe Penyusun</th>
                <th scope="col" class="px-6 py-3" v-show="data.discount_type !== 'GLOBAL'">
                  Barang
                </th>
                <th scope="col" class="px-6 py-3">Tipe Barang</th>
                <th scope="col" class="px-6 py-3" v-show="data.discount_type !== 'GLOBAL'">
                  Satuan
                </th>
                <th scope="col" class="px-6 py-3" v-show="data.discount_type !== 'GLOBAL'">
                  Harga
                </th>
                <th scope="col" class="px-6 py-3">Tipe Diskon</th>
                <th scope="col" class="px-6 py-3">Diskon</th>
                <th scope="col" class="px-6 py-3">Action</th>
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
                  <FieldSelect
                    :bind="{
                      disabled: !actionText || data.discount_type !== 'GLOBAL',
                      clearable: false
                    }"
                    class="w-full !mt-0"
                    :value="item.type"
                    @input="(v) => (item.type = v)"
                    :options="
                      data.discount_type !== 'GLOBAL'
                        ? ['ALL', 'ITEM', 'ITEM_TYPE']
                        : ['ALL', 'ITEM_TYPE']
                    "
                    placeholder=""
                    label=""
                    @update:valueFull="
                      (v) => {
                        delete item.m_item_type_id
                      }
                    "
                    :check="false"
                  />
                </td>
                <td class="px-6 py-4" v-show="data.discount_type !== 'GLOBAL'">
                  {{ item['m_item.item_name'] ?? '-' }}
                </td>
                <td class="px-6 py-4" v-if="data.discount_type !== 'GLOBAL'">
                  {{ item['m_item_type.name'] ?? '-' }}
                </td>
                <td class="px-6 py-4" v-else>
                  <FieldSelect
                    :bind="{
                      disabled: !actionText || item.type?.toLowerCase() !== 'item_type',
                      clearable: false
                    }"
                    class="w-full !mt-0"
                    :value="item.m_item_type_id"
                    @input="(v) => (item.m_item_type_id = v)"
                    valueField="id"
                    displayField="name"
                    :api="{
                      url: `${store.server}/operation/m_item_type`,
                      headers: {
                        'Content-Type': 'Application/json',
                        Authorization: `Bearer ${token}`
                      },
                      params: {
                        simplest: true
                      }
                    }"
                    placeholder=""
                    label=""
                    :check="false"
                  />
                </td>
                <td class="px-6 py-4" v-show="data.discount_type !== 'GLOBAL'">
                  {{ item['m_unit.name'] ?? '-' }}
                </td>
                <td class="px-6 py-4" v-show="data.discount_type !== 'GLOBAL'">
                  {{ (item['price'] ?? 0)?.toLocaleString('id') }}
                </td>
                <td class="px-6 py-4">
                  <FieldSelect
                    :bind="{
                      disabled: !actionText || (i !== 0 && data.discount_type == 'PROGRESIF'),
                      clearable: false
                    }"
                    class="w-full !mt-0"
                    :value="item.disc_type"
                    @input="(v) => (item.disc_type = v)"
                    :options="['%', 'AMT']"
                    placeholder=""
                    label=""
                    :check="false"
                  />
                </td>
                <td class="px-6 py-4">
                  <FieldNumber
                    :bind="{ readonly: !actionText, clearable: false }"
                    class="w-full !mt-0"
                    :value="item.disc"
                    @input="(v) => (item.disc = v)"
                    placeholder=""
                    label=""
                    :check="false"
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
