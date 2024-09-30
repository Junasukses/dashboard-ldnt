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
import { ref, reactive, nextTick, computed } from 'vue'
import menuNavBar from '@/menuNavBar.js'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import FieldPopupKode from '@/components/FieldPopupKode.vue'
import PaymentPopup from '@/components/PaymentPopup.vue'
import OpenCloseDaily from '@/components/OpenCloseDaily.vue'
import { useStore } from '@/stores/app'

const store = useStore()
const token = ref(localStorage.getItem('token') ?? import.meta.env.VITE_AUTH_TOKEN)
const activeTabIndex = ref(0)
const listItem = ref()
const barcodeInput = ref()
const values = reactive({ barcode: '', list_item: '' })
const form = reactive({})
const item = reactive({ group_data: [] })
const data = reactive({ netto: 0 })
const paymentPopup = ref()
const openCLoseDailyPopup = ref()

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

function newDataItem(newData) {
  const isData = item.group_data.filter((dt) => dt.id === newData.id)
  if (isData.length === 0) {
    item.group_data = [
      ...item.group_data,
      { ...newData, qty: 1, disc_percent: 0, disc_amount: 0, subtotal: newData.price }
    ]
  } else {
    item.group_data = item.group_data.map((dt) => {
      if (dt.id === newData.id) {
        return { ...dt, qty: dt.qty + 1, subtotal: dt.price * (dt.qty + 1) }
      } else {
        return dt
      }
    })
  }
}

function onEnterBarcode(data) {
  newDataItem(data)
  nextTick(() => {
    barcodeInput.value?.onReset()
    values.barcode = ''
  })
}

const grand_total = computed(() => {
  const total = item.group_data.reduce((a, b) => a + Number(b.subtotal), 0)
  data.netto = parseFloat(total)
  return data.netto
})

const resetAll = () => {
  let result = confirm('Lanjutkan reset data ?')
  if (result) {
    item.group_data = []
  }
}

function changeQty(type, id) {
  item.group_data = item.group_data.map((dt) => {
    if (dt.id === id) {
      if (type === 'plus') {
        return { ...dt, qty: dt.qty + 1, subtotal: dt.price * (dt.qty + 1) }
      } else if (type === 'min') {
        return { ...dt, qty: dt.qty - 1, subtotal: dt.price * (dt.qty - 1) }
      } else {
        return dt
      }
    } else {
      return dt
    }
  })

  item.group_data = item.group_data.filter((dt) => dt.qty > 0)
}

function deleteItem(id) {
  item.group_data = item.group_data.filter((dt) => dt.id !== id)
}

function openCloseDaily() {
  openCLoseDailyPopup.value?.open()
}
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
      <SectionMain class="!py-0 overflow-hidden">
        <div class="grid grid-cols-12 gap-[12px]">
          <div class="col-span-9">
            <h1 class="!ml-2 !font-bold !text-2xl">Selamat Datang Budi Santoso</h1>
            <h1 class="!ml-2 !font-bold !text-md">Kasir Shift II</h1>
            <h1 class="!ml-2 !font-bold !text-md">PERSADA POS</h1>
            <h1 class="!ml-2 !mb-4 !font-semibold !text-sm">
              Jl. MT. Haryono No.11, Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144
            </h1>
            <div class="flex flex-row justify-end space-x-2 w-full">
              <div
                style="cursor: pointer"
                class="!justify-end space-x-6 bg-gray-600 hover:bg-gray-700 text-white text-center py-1 px-4 text-[11px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
                @click="openCloseDaily"
              >
                <button class="flex flex-col items-center justify-center bg-red-500 text-white">
                  <BaseIcon :path="mdiFunction" size="20" />Open Close Daily
                </button>
              </div>
              <div
                style="cursor: pointer"
                class="!justify-end space-x-6 bg-purple-600 hover:bg-purple-700 text-white text-center py-1 px-4 text-[11px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
                @click="resetAll()"
              >
                <button class="flex flex-col items-center justify-center bg-red-500 text-white">
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
            </div>
            <div
              style="cursor: pointer"
              class="!justify-end space-x-6 bg-purple-600 hover:bg-purple-700 text-white text-center py-1 px-4 text-[11px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
              @click="resetAll()"
            >
              <button class="flex flex-col items-center justify-center bg-red-500 text-white">
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
                label="Member"
                placeholder="Cari Member"
                :value="form.name"
                @input="(v) => (form.name = v)"
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
                  ref="barcodeInput"
                  :value="values.barcode"
                  @input="(v) => (values.barcode = v)"
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

              <div class="flex items-center space-x-6">
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
                    <th scope="col" class="px-6 py-3 text-right">Harga</th>
                    <th scope="col" class="px-6 py-3">Qty</th>
                    <th scope="col" class="px-6 py-3">Disc (%)</th>
                    <th scope="col" class="px-6 py-3">Disc (Rp)</th>
                    <th scope="col" class="px-6 py-3 text-right">Sub Total</th>
                    <th scope="col" class="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="item.group_data.length === 0">
                    <td
                      colspan="8"
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
                    <td class="px-6 py-3 text-right">{{ formatNumber(dt.disc_percent) }}</td>
                    <td class="px-6 py-3 text-right">{{ formatNumber(dt.disc_amount) }}</td>
                    <td class="px-6 py-3 text-right">{{ formatNumber(dt.subtotal) }}</td>

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
                  <h1>{{ formatNumber(data.netto) }}</h1>
                </div>
                <div class="flex justify-between font-semibold">
                  <h1>Discount</h1>
                  <h1>{{ formatNumber(0) }}</h1>
                </div>
                <div class="flex justify-between font-semibold">
                  <h1>Pajak</h1>
                  <h1>{{ formatNumber(0) }}</h1>
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
            <PaymentPopup ref="paymentPopup" :data="data" />
            <OpenCloseDaily ref="openCLoseDailyPopup" :data="data" />
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
                <h1>{{ formatNumber(data.netto) }}</h1>
              </div>
              <div class="flex justify-between font-semibold">
                <h1>Discount</h1>
                <h1>{{ formatNumber(0) }}</h1>
              </div>
              <div class="flex justify-between font-semibold">
                <h1>Pajak</h1>
                <h1>{{ formatNumber(0) }}</h1>
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
          <PaymentPopup ref="paymentPopup" :data="data" />
        </div>
      </SectionMain>
    </div>
  </div>
</template>
