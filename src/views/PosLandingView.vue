<script setup>
import BaseIcon from '@/components/BaseIcon.vue'
import CardBox from '@/components/CardBox.vue'
import NavBar from '@/components/NavBar.vue'
import {
  mdiAccountGroupOutline,
  mdiCash,
  mdiListBoxOutline,
  mdiFunction,
  mdiBarcode,
  mdiLogout,
  mdiClose,
  mdiMinus,
  mdiPlus,
  mdiSaleOutline,
  mdiTrashCan
} from '@mdi/js'
import { ref, reactive, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import menuNavBar from '@/menuNavBar.js'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import FieldPopupKode from '@/components/FieldPopupKode.vue'
import PaymentPopup from '@/components/PaymentPopup.vue'
import OpenCloseDaily from '@/components/OpenCloseDaily.vue'
import { useStore } from '@/stores/app'
import axios from 'axios'

const store = useStore()
const token = ref(localStorage.getItem('token') ?? import.meta.env.VITE_AUTH_TOKEN)
const activeTabIndex = ref(0)
const listItem = ref()
const barcodeInput = ref()
const item = reactive({ group_data: [] })
const data = reactive({ netto: 0 })
const paymentPopup = ref()
const openCLoseDailyPopup = ref()
const arrayPayment = ref([])
const arrayPayment2 = ref([])
let initalValues

function formatNumber(amount, decimals = 2) {
  if (isNaN(amount)) {
    return ''
  }
  amount = amount ? Number(amount) : 0
  const roundedAmount = amount.toFixed(decimals)
  const [integerPart, decimalPart] = roundedAmount.split('.')
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `${formattedIntegerPart}${decimalPart ? ',' + decimalPart : ''}`
}

const formattedDate = ref(getFormattedDate())

function getFormattedDate() {
  const now = new Date()

  // Define options for the date format
  const dateOptions = {
    weekday: 'long', // Full name of the day
    year: 'numeric', // Full numeric year
    month: 'long', // Full name of the month
    day: 'numeric' // Numeric day of the month
  }
  const dateFormatter = new Intl.DateTimeFormat('id-ID', dateOptions)
  const formattedDate = dateFormatter.format(now)

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${formattedDate} ${hours}:${minutes}:${seconds}`
}

setInterval(() => {
  formattedDate.value = getFormattedDate()
}, 1000)

function openListItem() {
  nextTick(() => {
    listItem.value?.onEnter()
  })
}

async function newDataItem(newData) {
  const isData = item.group_data.filter((dt) => dt.id === newData.id)
  if (isData.length === 0) {
    item.group_data = [
      ...item.group_data,
      {
        ...newData,
        qty: 1,
        disc_percent: 0,
        disc_amt: 0,
        subtotal: newData.price,
        netto: newData.price_fix
      }
    ]
  } else {
    // ngapi ketika data sama di plus dua qtynya
    item.group_data = await Promise.all(
      item.group_data.map(async (dt) => {
        if (dt.id === id) {
          const res = await getPriceQty(dt.m_item_id, dt.unit_id, dt.qty + 1)
          return res
        }
        return dt
      })
    )
  }
}

function onEnterBarcode(data) {
  newDataItem(data)
  nextTick(() => {
    barcodeInput.value?.onReset()
    delete data.barcode
  })
}

const grand_total = computed(() => {
  const totalAmt = item.group_data.reduce((a, b) => a + Number(b.subtotal), 0)
  const totalDisc = item.group_data.reduce((a, b) => a + Number(b.disc_amt), 0)
  const totalNetto = item.group_data.reduce((a, b) => a + Number(b.price_fix), 0)
  console.log(totalDisc)
  data.amt = parseFloat(totalAmt)
  data.amt_disc = parseFloat(totalDisc)
  data.netto = parseFloat(totalNetto)
  return data.netto
})

const resetAll = () => {
  if (data.isOpen) {
    alertify
      .prompt(
        'Masukan Bypass Password',
        '',
        async (evt, value) => {
          if (value === '12345') {
            item.group_data = []
            paymentPopup.value?.onReset()
            alertify.success('Data berhasil di reset')
          } else {
            alertify.error('Bypass Password Salah')
          }
        },
        () => {}
      )
      .set('type', 'password')
  }
}

const getPriceQty = async (idItem, idUnit, qtyPar) => {
  try {
    const response = await axios.get('/operation/v_item_catalog/get_item_unit_qty', {
      params: {
        m_item_id: idItem,
        unit_id: idUnit,
        qty: qtyPar
      }
    })

    if (response.status !== 200) throw new Error('Failed when trying to read data')
    let tempData = response.data.data
    tempData.subtotal = parseInt(tempData.price)
    tempData.qty = parseInt(tempData.qty)
    tempData.disc = parseInt(tempData.disc)
    tempData.disc_amt = parseInt(tempData.disc_amt)
    tempData.price = parseInt(tempData.price)
    tempData.price_fix = parseInt(tempData.price_fix)
    return tempData
  } catch (err) {
    const errorMessage = err.response?.data || 'Failed to get data.'
    alertify.error(errorMessage)
  }
}
async function changeQty(type, id) {
  // Menambah qty
  if (type === 'plus') {
    item.group_data = await Promise.all(
      item.group_data.map(async (dt) => {
        if (dt.id === id) {
          const res = await getPriceQty(dt.m_item_id, dt.unit_id, dt.qty + 1)
          return res
        }
        return dt
      })
    )
  } else if (type === 'min') {
    alertify
      .prompt(
        'Masukan Bypass Password',
        '',
        async (evt, value) => {
          if (value === '12345') {
            item.group_data = await Promise.all(
              item.group_data.map(async (dt) => {
                if (dt.id === id) {
                  const res = await getPriceQty(dt.m_item_id, dt.unit_id, dt.qty - 1)
                  return res
                }
                return dt
              })
            )
            item.group_data = item.group_data.filter((dt) => dt.qty > 0)
            alertify.success('Qty Berhasil Dikurangi')
          } else {
            alertify.error('Bypass Password Salah')
          }
        },
        () => {}
      )
      .set('type', 'password')
  }
  item.group_data = item.group_data.filter((dt) => dt.qty > 0)
}

function deleteItem(id) {
  item.group_data = item.group_data.filter((dt) => dt.id !== id)
}

const getDaily = async () => {
  try {
    const response = await axios.get('/operation/t_daily/status')

    if (response.status !== 200) throw new Error('Failed when trying to read data')
    const dataDaily = response.data
    data.isOpen = dataDaily.data.is_open
    if (data.isOpen) {
      for (const key in dataDaily.data) {
        data[key] = dataDaily.data[key]
      }
    }
  } catch (err) {
    const errorMessage = err.response?.data || 'Failed to get data.'
    alertify.error(errorMessage)
  }
}

const successPayment = async () => {
  try {
    const response = await axios.get('/operation/t_daily/status')

    if (response.status !== 200) throw new Error('Failed when trying to read data')
    const dataDaily = response.data
    data.isOpen = dataDaily.data.is_open
    if (data.isOpen) {
      for (const key in dataDaily.data) {
        data[key] = dataDaily.data[key]
      }
    }
    item.group_data = []
  } catch (err) {
    const errorMessage = err.response?.data || 'Failed to get data.'
    alertify.error(errorMessage)
  }
}

const getPayment = async () => {
  try {
    const response = await axios.get('/operation/m_payment_type', {
      params: {
        selectfield: 'this.id,this.name'
      }
    })

    if (response.status !== 200) throw new Error('Failed when trying to read data')
    arrayPayment.value = response.data.data.map((item) => ({
      m_payment_type_id: item.id,
      name: item.name
    }))
  } catch (err) {
    const errorMessage = err.response?.data || 'Failed to get data.'
    alertify.error(errorMessage)
  }
}

const handleKeyDown = (event) => {
  if (data?.isOpen) {
    if (event?.ctrlKey && event?.key?.toLowerCase() === 'enter') {
      event.preventDefault()
      paymentPopup.value?.open()
    }
  }
}

onMounted(async () => {
  try {
    //

    window.addEventListener('keydown', handleKeyDown)
    store.setRequesting(true)
    await getDaily()
    await getPayment()
  } catch (err) {
    const errorMessage = err.response?.data || 'Failed to get data.'
    alertify.error(errorMessage)
  }
  for (const key in initalValues) {
    data[key] = initialValues[key]
  }

  store.setRequesting(false)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
<style scoped>
@tailwind base;

@layer base {
  tr {
    @apply max-w-full  border-b-4 border-gray-100 bg-white
       lg:border-b-0 dark:border-slate-800 text-center;
  }

  tr:last-child {
    @apply border-b-0;
  }
  td {
    @apply justify-between text-center py-3 px-4 align-top border-b border-gray-100
    table-cell lg:text-left lg:align-middle lg:border-b-0 dark:border-slate-800;
  }

  td:last-child {
    @apply border-b-0;
  }

  tbody tr,
  tbody tr:nth-child(odd) {
    @apply lg:hover:bg-gray-100 lg:dark:hover:bg-slate-700/70;
  }

  tbody tr:nth-child(odd) {
    @apply lg:bg-gray-100/50 lg:dark:bg-slate-800/50;
  }

  td:before {
    content: attr(data-label);
    @apply font-semibold pr-3 text-left lg:hidden;
  }
}
</style>
<template>
  <div class="overflow-hidden lg:overflow-visible">
    <div
      class="lg:ml-0 pt-4 h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100 flex"
    >
      <div class="grid grid-cols-12 gap-[12px] !py-0 overflow-hidden mx-6 w-full">
        <div class="col-span-9">
          <h1 class="!ml-2 !font-bold !text-2xl">Selamat Datang Budi Santoso</h1>
          <h1 class="!ml-2 !font-bold !text-md">Kasir Shift II</h1>
          <h1 class="!ml-2 !font-bold !text-md">PERSADA POS</h1>
          <h1 class="!ml-2 !mb-4 !font-semibold !text-sm">
            {{ 'Jl. MT. Haryono No.11, Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144' }}
          </h1>
          <div class="flex flex-row justify-end space-x-2 w-full">
            <div
              style="cursor: pointer"
              class="!justify-end space-x-6 bg-gray-600 hover:bg-gray-700 text-white text-center py-1 px-4 text-[11px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
              @click="openCLoseDailyPopup?.open()"
            >
              <button class="flex flex-col items-center justify-center bg-red-500 text-white">
                <BaseIcon :path="mdiFunction" size="20" />Open Close Daily
              </button>
            </div>
            <div
              class="space-x-6 text-center py-1 px-4 text-[11px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
              @click="resetAll()"
              :class="{
                'bg-gray-300 bg-opacity-50 cursor-default': !data.isOpen,
                'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer': data.isOpen
              }"
            >
              <button
                class="flex flex-col items-center justify-center bg-red-500 text-white"
                :disabled="!data.isOpen"
              >
                <BaseIcon :path="mdiClose" size="20" />Reset
              </button>
            </div>
            <div
              style="cursor: pointer"
              class="!justify-end space-x-6 bg-red-600 hover:bg-red-700 text-white text-center py-1 px-4 text-[11px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
            >
              <button class="flex flex-col items-center justify-center bg-red-500 text-white">
                <BaseIcon :path="mdiLogout" size="20" />Tutup POS
              </button>
            </div>
          </div>
          <div class="flex flex-wrap items-center space-x-4">
            <button
              @click="openListItem"
              class="!text-[#086968] !border-2 !border-[#086968] flex items-center !p-2 rounded-lg !font-semibold shadow-md cursor-pointer duration-150 transition hover:bg-[#086968] hover:!text-white"
            >
              <BaseIcon :path="mdiListBoxOutline" size="20" />
              <span class="ml-2">Daftar Item</span>
            </button>

            <FieldPopupKode
              :clickedRow="false"
              ref="listItem"
              :check="false"
              :api="{
                url: `${store.server}/operation/v_item_catalog`,
                headers: { 'Content-Type': 'Application/json', authorization: `Bearer ${token}` },
                params: {
                  simplest: true,
                  searchfield: 'this.item_code, this.item_name, this.barcode'
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
                  headerName: 'Barcode',
                  field: 'barcode',
                  width: 60,
                  flex: 1,
                  sortable: true,
                  resizable: true,
                  filter: true,
                  cellClass: ['justify-center', 'bg-gray-50']
                },
                {
                  headerName: 'Kode',
                  field: 'item_code',
                  width: 60,
                  flex: 1,
                  sortable: true,
                  resizable: true,
                  filter: true,
                  cellClass: ['justify-center', 'bg-gray-50']
                },
                {
                  headerName: 'Nama',
                  field: 'item_name',
                  width: 60,
                  flex: 1,
                  sortable: true,
                  resizable: true,
                  filter: true,
                  cellClass: ['justify-center', 'bg-gray-50']
                },
                {
                  headerName: 'Satuan',
                  field: 'unit',
                  width: 60,
                  flex: 1,
                  sortable: true,
                  resizable: true,
                  filter: true,
                  cellClass: ['justify-center', 'bg-gray-50']
                },
                {
                  headerName: 'Harga',
                  field: 'price',
                  width: 60,
                  flex: 1,
                  sortable: true,
                  resizable: true,
                  filter: true,
                  cellClass: ['justify-end', 'bg-gray-50']
                },
                {
                  headerName: 'Harga Disc',
                  field: 'price_fix',
                  width: 60,
                  flex: 1,
                  sortable: true,
                  resizable: true,
                  filter: true,
                  cellClass: ['justify-end', 'bg-gray-50']
                }
              ]"
              class="!mt-0 hidden"
            />

            <!-- <div
                class="flex items-center p-2 rounded-lg font-semibold shadow-md cursor-pointer duration-300 transition"
                :class="
                  activeTabIndex == 0
                    ? 'text-white bg-[#086968]'
                    : 'text-gray-600 hover:bg-gray-100 bg-white'
                "
                @click="activeTabIndex = 0"
              >
                <BaseIcon :path="mdiListBoxOutline" size="20" />
                <span class="ml-2">List Item</span>
              </div> -->
            <div
              class="flex items-center p-2 rounded-lg font-semibold shadow-md cursor-pointer duration-300 transition"
              :class="
                activeTabIndex == 1
                  ? 'text-white bg-[#086968]'
                  : 'text-gray-600 hover:bg-gray-100 bg-white'
              "
              @click="activeTabIndex = 1"
            >
              <BaseIcon :path="mdiAccountGroupOutline" size="20" />
              <span class="ml-2">Daftar Member</span>
            </div>
            <div
              class="flex items-center p-2 rounded-lg font-semibold shadow-md cursor-pointer duration-300 transition"
              :class="
                activeTabIndex == 2
                  ? 'text-white bg-[#086968]'
                  : 'text-gray-600 hover:bg-gray-100 bg-white'
              "
              @click="activeTabIndex = 2"
            >
              <BaseIcon :path="mdiSaleOutline" size="20" />
              <span class="ml-2">Daftar Diskon</span>
            </div>
            <div class="flex items-center space-x-6">
              <FieldX
                :bind="{ readonly: !data.isOpen }"
                label="Member"
                placeholder="Cari Member"
                :value="data.name"
                @input="(v) => (data.name = v)"
                class="!mt-0"
                :check="false"
              />
            </div>
            <h2>Member: -</h2>
          </div>

          <CardBox class="mt-4">
            <div class="flex items-center justify-between font-semibold mb-6">
              <div class="flex justify-between items-center space-x-6">
                <BaseIcon :path="mdiBarcode" size="35" />
                <FieldPopupKode
                  :bind="{ readonly: !data.isOpen }"
                  ref="barcodeInput"
                  @input="(v) => (data.barcode = v)"
                  :check="false"
                  @update:valueFull="onEnterBarcode"
                  valueField="id"
                  displayField="barcode"
                  :api="{
                    url: `${store.server}/operation/v_item_catalog`,
                    headers: {
                      'Content-Type': 'Application/json',
                      authorization: `Bearer ${token}`
                    },
                    params: {
                      simplest: true,
                      searchfield: 'this.item_code, this.item_name, this.barcode'
                    },
                    onsuccess: (response) => {
                      response.data = [...response.data].map((dt) => {
                        dt['m_item_price_id'] = dt['id']
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
                      headerName: 'Barcode',
                      field: 'barcode',
                      width: 60,
                      flex: 1,
                      sortable: true,
                      resizable: true,
                      filter: true,
                      cellClass: ['justify-center', 'bg-gray-50']
                    },
                    {
                      headerName: 'Kode',
                      field: 'item_code',
                      width: 60,
                      flex: 1,
                      sortable: true,
                      resizable: true,
                      filter: true,
                      cellClass: ['justify-center', 'bg-gray-50']
                    },
                    {
                      headerName: 'Nama',
                      field: 'item_name',
                      width: 60,
                      flex: 1,
                      sortable: true,
                      resizable: true,
                      filter: true,
                      cellClass: ['justify-center', 'bg-gray-50']
                    },
                    {
                      headerName: 'Satuan',
                      field: 'unit',
                      width: 60,
                      flex: 1,
                      sortable: true,
                      resizable: true,
                      filter: true,
                      cellClass: ['justify-center', 'bg-gray-50']
                    }
                  ]"
                  class="!mt-0 !ml-2"
                />
              </div>

              <div class="flex items-center space-x-6" :class="{ 'ml-auto': !data.isOpen }">
                <h2 class="!text-md" style="text-wrap: nowrap">Grand Total</h2>
                <span
                  @click="paymentPopup?.open()"
                  style="cursor: pointer"
                  class="text-3xl text-blue-900"
                  >{{ formatNumber(grand_total) }}</span
                >
              </div>
            </div>

            <div class="relative overflow-x-auto">
              <table
                class="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400 text-base"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3 w-[5%]">No</th>
                    <th scope="col" class="px-6 py-3">Nama Item</th>
                    <th scope="col" class="px-6 py-3">Unit</th>
                    <th scope="col" class="px-6 py-3 text-right">Harga</th>
                    <th scope="col" class="px-6 py-3">Qty</th>
                    <th scope="col" class="px-6 py-3">Disc</th>
                    <th scope="col" class="px-6 py-3">Disc Total</th>
                    <th scope="col" class="px-6 py-3 text-right">Sub Total</th>
                    <th scope="col" class="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="item.group_data.length === 0">
                    <td
                      colspan="9"
                      class="h-20 w-full flex items-center justify-center !text-center"
                    >
                      Belum ada item yang ditambahkan
                    </td>
                  </tr>
                  <tr
                    v-for="(dt, i) in item.group_data"
                    :key="i"
                    class="bg-white border-b dark:border-gray-700"
                  >
                    <td class="px-6 py-3">{{ i + 1 }}</td>
                    <td class="px-6 py-3">{{ dt.item_name }}</td>
                    <td class="px-6 py-3">{{ dt.unit }}</td>
                    <td class="px-6 py-3 text-right">{{ formatNumber(dt.price) }}</td>
                    <td class="px-6 py-3 text-right">
                      <div class="flex gap-2 items-center justify-around">
                        <BaseButton
                          @click="changeQty('min', dt.id)"
                          color="black"
                          :icon="mdiMinus"
                          small
                          :rounded-full="true"
                        />
                        <span class="text-right">{{ dt.qty }}</span>

                        <BaseButton
                          @click="changeQty('plus', dt.id)"
                          color="black"
                          :icon="mdiPlus"
                          small
                          :rounded-full="true"
                        />
                      </div>
                    </td>
                    <td class="px-6 py-3 text-right">
                      {{ formatNumber(dt.disc) + (dt.disc_type == '%' ? '%' : '') }}
                    </td>
                    <td class="px-6 py-3 text-right">{{ formatNumber(dt.disc_amt) }}</td>
                    <td class="px-6 py-3 text-right">{{ formatNumber(dt.price_fix) }}</td>

                    <td class="px-6 py-3">
                      <BaseButtons type="justify-center" no-wrap>
                        <BaseButton
                          @click="deleteItem(dt.id)"
                          color="danger"
                          :icon="mdiTrashCan"
                          small
                        />
                      </BaseButtons>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBox>

          <div class="row-span-2 col-span-3 text-[12px] h-full">
            <CardBox class="!h-[full]">
              <h1 class="font-bold text-center text-xl">Detail Nota</h1>
              <div class="flex justify-between items-center py-2 border-t border-b my-4">
                <div>
                  <span>List Order</span>
                </div>
                <div>
                  <span>{{ formattedDate }}</span>
                </div>
              </div>
              <div v-for="(dt, i) in item.group_data" class="flex flex-col border-b" :key="i">
                <div class="flex justify-between font-semibold">
                  <h1>{{ dt.item_name }}</h1>
                  <h1>{{ formatNumber(dt.subtotal) }}</h1>
                </div>
                <div class="flex my-2">
                  <h1 class="mr-2">x{{ formatNumber(dt.qty) }}</h1>
                  <h1>@{{ formatNumber(dt.price) }}</h1>
                </div>
              </div>

              <div class="flex flex-col border-b py-2 space-y-2">
                <div class="flex justify-between font-semibold">
                  <h1>Sub Total</h1>
                  <h1>{{ formatNumber(data.amt) }}</h1>
                </div>
                <div class="flex justify-between font-semibold">
                  <h1>Discount</h1>
                  <h1>{{ formatNumber(data.amt_disc) }}</h1>
                </div>
              </div>

              <div class="flex flex-col space-y-2">
                <div class="flex justify-between font-semibold">
                  <h1>Total</h1>
                  <h1>{{ formatNumber(data.netto) }}</h1>
                </div>

                <div class="flex justify-between font-semibold">
                  <h1>Bayar</h1>
                  <h1>-</h1>
                </div>

                <div class="flex justify-between font-semibold">
                  <h1>Kembali</h1>
                  <h1>-</h1>
                </div>
              </div>
            </CardBox>
            <PaymentPopup
              ref="paymentPopup"
              :data="data"
              :payment="arrayPayment"
              :arr-detail="item.group_data"
              @saveSuccess="successPayment"
            />
            <OpenCloseDaily
              ref="openCLoseDailyPopup"
              :data="data"
              @saveSuccess="getDaily"
              :payment="arrayPayment"
            />
          </div>
        </div>

        <div class="row-span-2 col-span-3 text-[12px] h-full">
          <CardBox class="!h-[full]">
            <h1 class="font-bold text-center !text-xl">Detail Nota</h1>
            <div class="flex flex-col justify-center items-center py-2 border-t border-b mt-2 mb-4">
              <div>
                <span>List Order</span>
              </div>
              <div>
                <span>{{ formattedDate }}</span>
              </div>
            </div>
            <div v-for="(dt, i) in item.group_data" class="flex flex-col border-b">
              <div class="flex justify-between font-semibold">
                <h1>{{ dt.item_name }}</h1>
                <h1>{{ formatNumber(dt.subtotal) }}</h1>
              </div>
              <div class="flex my-2">
                <h1 class="mr-2">x{{ formatNumber(dt.qty) }}</h1>
                <h1>@{{ formatNumber(dt.price) }}</h1>
              </div>
            </div>

            <div class="flex flex-col border-b py-2 space-y-2">
              <div class="flex justify-between font-semibold">
                <h1>Sub Total</h1>
                <h1>{{ formatNumber(data.amt) }}</h1>
              </div>
              <div class="flex justify-between font-semibold">
                <h1>Discount</h1>
                <h1>{{ formatNumber(data.amt_disc) }}</h1>
              </div>
            </div>

            <div class="flex flex-col space-y-2">
              <div class="flex justify-between font-semibold">
                <h1>Total</h1>
                <h1>{{ formatNumber(data.netto) }}</h1>
              </div>

              <div class="flex justify-between font-semibold">
                <h1>Bayar</h1>
                <h1>-</h1>
              </div>

              <div class="flex justify-between font-semibold">
                <h1>Kembali</h1>
                <h1>-</h1>
              </div>
            </div>
          </CardBox>
        </div>
      </div>
    </div>
  </div>
</template>
