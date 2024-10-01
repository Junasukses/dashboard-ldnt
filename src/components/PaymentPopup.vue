<template>
  <vue-final-modal v-model="isOpenPopup" attach="#app" :drag="true" :resize="true">
    <div
      v-if="isOpenPopup"
      class="top-0 left-0 w-screen h-screen !m-0 flex items-center justify-center animated animate-fade-in animate-duration-75"
    >
      <div
        class="absolute z-41 top-0 left-0 bg-dark-50 w-full h-full bg-opacity-50"
        @click.self="isOpenPopup = !isOpenPopup"
      />
      <div class="z-42 py-3 px-3 h-auto <md:px-0 bg-white w-3/4 <md:w-full rounded relative">
        <h2 class="text-xl font-semibold mb-2 text-center">Menu Pembayaran</h2>
        <hr />

        <div class="grid grid-cols-3 gap-x-4 p-4">
          <div class="col-span-2">
            <div
              class="border border-gray-200 !w-auto !h-auto p-2 rounded rounded-md mb-2 bg-gray-100"
            >
              <div class="grid grid-cols-3">
                <div>
                  <h4 class="text-sm">Kasir : Budi Santoso</h4>
                  <h4 class="text-sm">Shift : II</h4>
                </div>
                <div>
                  <h4 class="text-sm">Member : Ima Mulyani</h4>
                  <h4 class="text-sm">Tipe Member : Gold</h4>
                </div>
                <div>
                  <h4 class="text-sm">Promo Terpakai : -</h4>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-12 gap-[12px] h-[400px]">
              <div class="col-span-2 space-y-[12px]">
                <div
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  :class="prop.data.netto > 10000 ? '!hover:bg-red-500  !bg-red-300' : ''"
                  @click="changeAmtMoney(10000)"
                >
                  10.000
                </div>
                <div
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  :class="prop.data.netto > 20000 ? '!hover:bg-red-500  !bg-red-300' : ''"
                  @click="changeAmtMoney(20000)"
                >
                  20.000
                </div>
                <div
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  :class="prop.data.netto > 50000 ? '!hover:bg-red-500  !bg-red-300' : ''"
                  @click="changeAmtMoney(50000)"
                >
                  50.000
                </div>

                <div
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  :class="prop.data.netto > 100000 ? '!hover:bg-red-500  !bg-red-300' : ''"
                  @click="changeAmtMoney(100000)"
                >
                  100.000
                </div>

                <div
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  :class="prop.data.netto > 500000 ? '!hover:bg-red-500  !bg-red-300' : ''"
                  @click="changeAmtMoney(500000)"
                >
                  500.000
                </div>
              </div>
              <div class="grid grid-cols-3 gap-[12px] col-span-10">
                <div
                  id="n7"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  @click="changeKeypad(7)"
                >
                  7
                </div>
                <div
                  id="n8"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  @click="changeKeypad(8)"
                >
                  8
                </div>
                <div
                  id="n9"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  @click="changeKeypad(9)"
                >
                  9
                </div>
                <div
                  id="n4"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  @click="changeKeypad(4)"
                >
                  4
                </div>
                <div
                  id="n5"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  @click="changeKeypad(5)"
                >
                  5
                </div>
                <div
                  id="n6"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  @click="changeKeypad(6)"
                >
                  6
                </div>
                <div
                  id="n1"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  @click="changeKeypad(1)"
                >
                  1
                </div>
                <div
                  id="n2"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  @click="changeKeypad(2)"
                >
                  2
                </div>
                <div
                  id="n3"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  @click="changeKeypad(3)"
                >
                  3
                </div>

                <div
                  id="equal"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg operator"
                  @click="changeKeypad('C')"
                >
                  C
                </div>

                <div
                  id="n0"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                  @click="changeKeypad(0)"
                >
                  0
                </div>
                <div
                  id="equal"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg operator"
                  @click="changeKeypad('clear')"
                >
                  <BaseIcon :path="mdiBackspace" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="flex flex-col gap-2">
              <div class="flex">
                <label class="w-[200px]">Total Belanja</label>
                <FieldNumber
                  :bind="{ readonly: true }"
                  :value="prop.data?.netto"
                  :check="false"
                  class="w-1/2 !mt-0"
                />
              </div>
              <div class="flex">
                <label class="w-[200px]">Diskon</label>
                <FieldNumber
                  :bind="{ readonly: true }"
                  :value="prop.data?.amt_disc"
                  :check="false"
                  class="w-1/2 !mt-0"
                />
              </div>
              <div class="text-right">
                <label class="w-[200px]">Total Yang Harus Dibayarkan</label>
                <h4 class="font-bold text-3xl">Rp. {{ formatNumber(prop.data?.netto) }}</h4>
              </div>
              <div class="flex">
                <label class="w-[200px]">Jumlah Bayar</label>
                <FieldNumber
                  :bind="{ readonly: false }"
                  :value="data.amt_pay"
                  @input="changeAmtPay"
                  :check="false"
                  class="w-1/2 !mt-0"
                />
              </div>
              <div class="flex">
                <label class="w-[200px]">Sisa</label>
                <FieldNumber
                  :bind="{ readonly: true }"
                  :value="data.change"
                  :check="false"
                  class="w-1/2 !mt-0"
                />
              </div>
              <div class="flex">
                <label class="w-[230px]">Jml Donasi</label>
                <FormCheckRadio
                  v-model="isDonasiManual"
                  @change="
                    () => {
                      data.amt_donation = 0
                      changeAmtDonation(0)
                    }
                  "
                  name="form radio"
                  inputValue="tes"
                />
                <FieldNumber
                  :bind="{ readonly: !isDonasiManual }"
                  :value="data.amt_donation"
                  @input="changeAmtDonation"
                  :check="false"
                  class="w-1/2 !mt-0"
                />
              </div>
              <div class="flex">
                <label class="w-[100px]">Kembali</label>
                <FieldNumber
                  :bind="{ readonly: true }"
                  :value="data.amt_change"
                  :check="false"
                  class="w-1/2 !mt-0"
                />
              </div>
              <div class="flex justify-between items-center mt-2">
                <h1 class="font-semibold">Pilih Metode Pembayaran</h1>
              </div>
              <div class="flex items-stretch text-sm bg-[#f4f4f4] gap-2 rounded-lg">
                <button
                  class="w-full flex items-center justify-center text-gray-600 hover:bg-[#086968] rounded-lg duration-300 hover:text-white"
                  :class="{ ' text-white font-bold': activeTabIndex === 0 }"
                  @click="activeTabIndex = 0"
                >
                  <div
                    class="w-full h-full flex flex-col items-center justify-center p-1"
                    :class="{ 'rounded-lg bg-[#086968]': activeTabIndex == 0 }"
                  >
                    <BaseIcon :path="mdiCash" size="80" />
                    <span class="font-normal">Cash</span>
                  </div>
                </button>
                <button
                  class="w-full flex items-center justify-center bg-[#f4f4f4] text-gray-600 duration-300"
                  :class="{ 'text-white font-bold': activeTabIndex === 1 }"
                  @click="activeTabIndex = 1"
                >
                  <div
                    class="w-full h-full flex flex-col space-y-1 items-center justify-center bg-none p-1 hover:bg-[#086968] rounded-lg duration-300 hover:text-white"
                    :class="{ 'rounded-lg bg-[#086968]': activeTabIndex == 1 }"
                  >
                    <BaseIcon :path="mdiCreditCard" size="80" />
                    <span class="font-normal">Card</span>
                  </div>
                </button>
                <button
                  class="w-full flex items-center justify-center border-b-2 bg-[#f4f4f4] rounded-tr-lg hover:bg-[#086968] rounded-lg duration-300 hover:text-white"
                  :class="{ 'text-white font-bold': activeTabIndex === 2 }"
                  @click="activeTabIndex = 2"
                >
                  <div
                    class="w-full h-full flex flex-col space-y-1 items-center justify-center bg-none p-1"
                    :class="{ 'rounded-lg bg-[#086968]': activeTabIndex == 2 }"
                  >
                    <BaseIcon :path="mdiLineScan" />
                    <span class="font-normal">E-Wallet</span>
                  </div>
                </button>
              </div>
              <div class="flex items-center space-x-2 mt-3">
                <div
                  style="cursor: pointer"
                  class="bg-blue-600 hover:bg-[#086968] text-white w-full h-full text-center py-2 text-[13px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
                >
                  <button class="flex flex-col items-center justify-center">
                    <BaseIcon :path="mdiContentSave" size="20" />Simpan
                  </button>
                </div>
                <div
                  style="cursor: pointer"
                  class="bg-green-600 hover:bg-green-700 text-white w-full h-full text-center py-2 text-[13px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
                >
                  <button class="flex flex-col items-center justify-center">
                    <BaseIcon :path="mdiPrinter" size="20" />Simpan & Cetak
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>
<script setup>
import BaseIcon from '@/components/BaseIcon.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormControl from '@/components/FormControl.vue'
import IconRounded from '@/components/IconRounded.vue'
import NavBar from '@/components/NavBar.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import {
  mdiBackspace,
  mdiBallotOutline,
  mdiCash,
  mdiContentSave,
  mdiCreditCard,
  mdiLineScan,
  mdiPrinter
} from '@mdi/js'
import { ref, reactive, readonly, computed } from 'vue'
import menuNavBar from '@/menuNavBar.js'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'

const isOpenPopup = ref(false)
const isDonasiManual = ref(false)
const activeTabIndex = ref(0)

const data = reactive({})

function onReset() {
  console.log(data)
  Object.keys(data).forEach((key) => {
    delete data[key]
  })
  console.log(data)
}

const prop = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  payment: {
    type: Array,
    default: () => []
  }
})

function open() {
  isOpenPopup.value = true
}

defineExpose({
  open,
  onReset
})
const changeKeypad = (v) => {
  if (v == 'C') {
    countAmtPay(0)
  }

  let last_val = data?.amt_pay ?? 0
  if (v == 'clear') {
    let last_val_str = last_val?.toString()?.slice(0, -1)
    countAmtPay(Number(last_val_str))
  }
  if (v != 'clear' && v != 'C') {
    let last_val_str = last_val?.toString() + v
    countAmtPay(Number(last_val_str))
  }
}
const changeAmtMoney = (v) => {
  if (prop.data.netto > v) return
  countAmtPay(v)
}
const changeAmtPay = (v) => {
  countAmtPay(v)
}
const countAmtPay = (v) => {
  const total = v - prop.data?.netto
  data.amt_pay = v
  data.change = parseFloat(total)
  changeAmtDonation(0)
}
const changeAmtDonation = (v) => {
  const total = data.change - v
  data.amt_donation = v
  data.amt_change = total
}

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
</script>
