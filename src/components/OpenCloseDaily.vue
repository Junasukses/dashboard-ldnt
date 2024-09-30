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
      <div class="z-42 py-3 px-3 h-auto <md:px-0 bg-white w-1/2 <md:w-full rounded relative">
        <h2 class="text-xl font-semibold mb-2 text-center">Open Close Daily</h2>
        <hr class="mb-2" />
        <div class="grid gap-y-2">
          <div class="flex gap-x-2">
            <button
              class="w-full flex items-center justify-center bg-[#f4f4f4] text-gray-600 duration-300"
              :class="{ 'text-white font-bold': activeTabIndex === 1 }"
              @click="activeTabIndex = 1"
            >
              <div
                class="w-full h-full flex flex-col space-y-1 items-center justify-center bg-none p-1 hover:bg-[#086968] rounded-lg duration-300 hover:text-white"
                :class="{ 'rounded-lg bg-[#086968]': activeTabIndex == 1 }"
              >
                <BaseIcon :path="mdiLineScan" size="80" />
                <span class="font-normal">OPEN</span>
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
                <span class="font-normal">CLOSE</span>
              </div>
            </button>
          </div>
          <div class="flex">
            <label class="w-[230px]">Kasir</label>
            <FieldX
              :bind="{ readonly: true }"
              :value="'Budi Santoso'"
              :check="false"
              class="w-1/2 !mt-0"
            />
          </div>
          <div class="flex" v-if="activeTabIndex === 1">
            <label class="w-[230px]">Open Saldo Kasir</label>
            <FieldNumber :bind="{ readonly: false }" :check="false" class="w-1/2 !mt-0" />
          </div>
          <div class="flex" v-else>
            <label class="w-[230px]">Close Saldo Kasir</label>
            <FieldNumber :bind="{ readonly: false }" :check="false" class="w-1/2 !mt-0" />
          </div>
          <div class="flex">
            <div
              style="cursor: pointer"
              class="bg-blue-600 hover:bg-[#086968] text-white w-full h-full text-center py-2 text-[13px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
            >
              Simpan
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

const prop = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})

function open() {
  isOpenPopup.value = true
}

defineExpose({
  open
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
