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
              class="w-full flex items-center justify-center border-b-2 rounded-tr-lg rounded-lg duration-300"
              :class="{
                'text-white font-bold bg-[#086968] opacity-100': !prop.data.isOpen,
                'bg-gray-300 bg-opacity-50': prop.data.isOpen
              }"
              :disabled="prop.data.isOpen"
            >
              <div
                class="w-full h-full flex flex-col space-y-1 items-center justify-center bg-none p-1"
                :class="{ 'rounded-lg bg-[#086968]': !prop.data.isOpen }"
              >
                <BaseIcon :path="mdiLineScan" size="80" />
                <span class="font-normal">OPEN</span>
              </div>
            </button>
            <button
              class="w-full flex items-center justify-center border-b-2 rounded-tr-lg rounded-lg duration-300"
              :class="{
                'text-white font-bold bg-[#086968] opacity-100': prop.data.isOpen,
                'bg-gray-300 bg-opacity-50': !prop.data.isOpen
              }"
              :disabled="!prop.data.isOpen"
            >
              <div
                class="w-full h-full flex flex-col space-y-1 items-center justify-center bg-none p-1"
                :class="{ 'rounded-lg bg-[#086968]': prop.data.isOpen }"
              >
                <BaseIcon :path="mdiLineScan" />
                <span class="font-normal">CLOSE</span>
              </div>
            </button>
          </div>
          <div class="grid grid-cols-5 gap-2" v-if="!prop.data.isOpen">
            <label class="col-span-2">Shift</label>
            <FieldSelect
              :bind="{ disabled: false, clearable: false }"
              class="w-full !mt-0 col-span-3"
              :value="data.shift"
              @input="(v) => (data.shift = v)"
              :errorText="formErrors.shift ? 'failed' : ''"
              :hints="formErrors.shift"
              :options="['1', '2', '3']"
              placeholder="Pilih Shift"
              label=""
              :check="false"
            />
            <label class="col-span-2">Open Saldo Kasir</label>
            <FieldNumber
              :bind="{ readonly: false }"
              :value="data.open_saldo"
              @input="(v) => (data.open_saldo = v)"
              :errorText="formErrors.open_saldo ? 'failed' : ''"
              :hints="formErrors.open_saldo"
              :check="false"
              class="w-1/2 !mt-0 col-span-3"
              placeholder="Masukan Open Saldo"
              label=""
            />
          </div>
          <div class="grid grid-cols-5 gap-2" v-else>
            <label class="col-span-2">Shift</label>
            <FieldSelect
              :bind="{ disabled: true, clearable: false }"
              class="w-full !mt-0 col-span-3"
              :value="prop.data.shift"
              @input="(v) => (prop.data.shift = v)"
              :options="['1', '2', '3']"
              placeholder="Pilih Shift"
              label=""
              :check="false"
            />
            <div
              v-for="(item, index) in detailArr"
              :key="index"
              class="col-span-5 grid grid-cols-5 gap-2"
            >
              <label class="col-span-2">{{ item.name }}</label>
              <FieldNumber
                :bind="{ readonly: false }"
                class="w-full !mt-0 col-span-3"
                :value="item.close_saldo"
                @input="(v) => (item.close_saldo = v)"
                placeholder="Masukan Close Saldo"
                label=""
                :check="false"
              />
            </div>
          </div>
          <div class="flex">
            <div
              style="cursor: pointer"
              class="bg-blue-600 hover:bg-blue-700 duration-200 transition text-white w-full h-full text-center py-2 text-[13px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
              @click="onsave"
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
import { mdiLineScan } from '@mdi/js'
import { ref, reactive, defineEmits, readonly, computed, watch } from 'vue'
import alertify from 'alertifyjs'
import axios from 'axios'
import { useStore } from '@/stores/app'

const isOpenPopup = ref(false)
const formErrors = ref({})

const emit = defineEmits(['saveSuccess'])
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

const data = reactive({})
const detailArr = ref([...prop.payment])
const store = useStore()

watch(
  () => prop.payment,
  (newPayment) => {
    detailArr.value = [...newPayment]
  }
)
function open() {
  isOpenPopup.value = true
}

const onsave = async () => {
  try {
    store.setRequesting(true)
    if (prop.data.isOpen) {
      data.t_daily_d = detailArr.value
    } else {
      data.open_saldo = data.open_saldo ?? 0
    }
    const response = await axios.post('/operation/t_daily/send_daily', data)

    alertify.success(response.data.message)
    emit('saveSuccess')
    isOpenPopup.value = false
    formErrors.value = {}
  } catch (err) {
    const { response } = err
    const errorMessage =
      response?.data?.errors?.[0] ||
      response?.data?.message ||
      'Oops, sesuatu yang salah terjadi. Coba kembali nanti.'

    formErrors.value = response?.data?.errors || {}
    console.log(formErrors.value)
    alertify.error(errorMessage)
  }
  delete data.open_saldo
  store.setRequesting(false)
}

defineExpose({
  open
})
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
