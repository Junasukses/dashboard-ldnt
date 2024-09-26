<script setup>
import CardBox from '@/components/CardBox.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { mdiBallotOutline } from '@mdi/js'
import { ref } from 'vue'

const logList = ref('')
const current = ref('')
const answer = ref('')
const operatorClicked = ref(true)

const formatNumber = (value) => {
  // Check if the value is empty or null/undefined
  if (value === '' || value === null || value === undefined) {
    return '' // Return empty string for no value
  }

  const num = Number(value) // Convert the value to a number
  if (!isNaN(num)) {
    return num.toLocaleString('id') // Format with thousands separators
  }

  return value // Return the original value if it's not a number
}
const append = (number) => {
  if (operatorClicked.value) {
    current.value = ''
    operatorClicked.value = false
  }
  current.value = `${current.value}${number}`
}

const addtoLog = (operator) => {
  if (!operatorClicked.value) {
    logList.value += `${formatNumber(current.value)} ${operator} `
    current.value = ''
    operatorClicked.value = true
  }
}

const clear = () => {
  current.value = ''
  answer.value = ''
  logList.value = ''
  operatorClicked.value = false
}

const sign = () => {
  if (current.value != '') {
    current.value = current.value.charAt(0) === '-' ? current.value.slice(1) : `-${current.value}`
  }
}

const percent = () => {
  if (current.value != '') {
    current.value = `${parseFloat(current.value) / 100}`
  }
}

const dot = () => {
  if (current.value.indexOf('.') === -1) {
    append('.')
  }
}

const divide = () => {
  addtoLog('/')
}

const times = () => {
  addtoLog('*')
}

const minus = () => {
  addtoLog('-')
}

const plus = () => {
  addtoLog('+')
}

const equal = () => {
  if (!operatorClicked.value) {
    answer.value = eval(logList.value + current.value)
  } else {
    answer.value = 'Error Number not found'
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Halaman Pembayaran" main>
      </SectionTitleLineWithButton>
      <div class="grid grid-cols-12 gap-[12px]">
        <div class="row-span-2 col-span-2 text-xs">
          <CardBox>
            <h1 class="font-semibold text-center text-base">Detail Nota</h1>
            <div class="flex justify-between items-center py-4 borter-t border-b flex-wrap">
              <span>List Order</span>
              <span>Kamis, 14 Oktober 2024</span>
            </div>
          </CardBox>
        </div>
        <!-- Info Nota -->
        <div class="col-span-5">
          <CardBox>
            <table class="">
              <thead>
                <tr>
                  <th colspan="3" class="p-0 pb-2 text-xl">Info Nota</th>
                </tr>
              </thead>
              <tbody>
                <tr class="!bg-white">
                  <td class="whitespace-normal align-top !border-0 p-0 w-[10%]">Tgl</td>
                  <td class="whitespace-normal align-top !border-0 p-0 px-1 w-[1%]">:</td>
                  <td class="whitespace-normal align-top !border-0 p-0">09/03/2024 18:20:22</td>
                </tr>
                <tr class="!bg-white">
                  <td class="whitespace-normal align-top !border-0 p-0 w-[10%]">Nomor</td>
                  <td class="whitespace-normal align-top !border-0 p-0 px-1 w-[1%]">:</td>
                  <td class="whitespace-normal align-top !border-0 p-0">INV-20240309000025</td>
                </tr>
                <tr class="!bg-white">
                  <td class="whitespace-normal align-top !border-0 p-0 w-[10%]">Kasir</td>
                  <td class="whitespace-normal align-top !border-0 p-0 px-1 w-[1%]">:</td>
                  <td class="whitespace-normal align-top !border-0 p-0">Widya</td>
                </tr>
                <tr class="!bg-white">
                  <td class="whitespace-normal align-top !border-0 p-0 w-[10%]">Shift</td>
                  <td class="whitespace-normal align-top !border-0 p-0 px-1 w-[1%]">:</td>
                  <td class="whitespace-normal align-top !border-0 p-0">1</td>
                </tr>
                <tr class="!bg-white">
                  <td></td>
                </tr>
              </tbody>
            </table>
          </CardBox>
        </div>
        <!-- Info Member -->
        <div class="col-span-5">
          <CardBox>
            <table>
              <thead>
                <tr>
                  <th colspan="3" class="p-0 pb-2 text-xl">Info Member</th>
                </tr>
              </thead>
              <tbody>
                <tr class="!bg-white">
                  <td class="whitespace-normal align-top !border-0 p-0 w-[10%]">Kode/Nama</td>
                  <td class="whitespace-normal align-top !border-0 p-0 px-1 w-[1%]">:</td>
                  <td class="whitespace-normal align-top !border-0 p-0">C0001/Sari</td>
                </tr>
                <tr class="!bg-white">
                  <td class="whitespace-normal align-top !border-0 p-0 w-[10%]">No Telp</td>
                  <td class="whitespace-normal align-top !border-0 p-0 px-1 w-[1%]">:</td>
                  <td class="whitespace-normal align-top !border-0 p-0">08772788321</td>
                </tr>
                <tr class="!bg-white">
                  <td class="whitespace-normal align-top !border-0 p-0 w-[10%]">Alamat</td>
                  <td class="whitespace-normal align-top !border-0 p-0 px-1 w-[1%]">:</td>
                  <td class="align-top !border-0 p-0">
                    Jl. Soekarno Hatta No. 45 asaksa aksaks aksaks aksaksaks aksaksaksa aksaksak
                    aksaks akska askaksa aksaks
                  </td>
                </tr>
                <tr class="!bg-white">
                  <td class="whitespace-normal align-top !border-0 p-0 w-[10%]">Point</td>
                  <td class="whitespace-normal align-top !border-0 p-0 px=1 w-[1%]">:</td>
                  <td class="whitespace-normal align-top !border-0 p-0">35</td>
                </tr>
              </tbody>
            </table>
          </CardBox>
        </div>

        <CardBox class="col-span-7">
          <div class="grid grid-cols-12 gap-[12px]">
            <div class="col-span-12 border-b border-[#e1e1e1]">
              <div class="col-span-4 answer text-5xl font-medium text-[#146080] h-[65px]">
                {{ formatNumber(answer) }}
              </div>
              <div
                class="col-span-4 display text-[#a3a3a3] mb-4 overflow-hidden text-clip h-8 text-xl"
              >
                {{ formatNumber(logList) + formatNumber(current) }}
              </div>
            </div>
            <div class="col-span-2 space-y-[12px]">
              <div
                @click="append('10000')"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                10.000
              </div>
              <div
                @click="append('50000')"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                50.000
              </div>

              <div
                @click="append('100000')"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                100.000
              </div>

              <div
                @click="append('1000000')"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                1.000.000
              </div>
            </div>
            <div class="grid grid-cols-4 gap-[12px] col-span-10">
              <div
                @click="clear"
                id="clear"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg operator focus:!outline-none focus:bg-red-600"
              >
                C
              </div>

              <div
                @click="sign"
                id="sign"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg operator"
              >
                +/-
              </div>
              <div
                @click="percent"
                id="percent"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg operator"
              >
                %
              </div>
              <div
                @click="divide"
                id="divide"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg operator"
              >
                /
              </div>
              <div
                @click="append('7')"
                id="n7"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                7
              </div>
              <div
                @click="append('8')"
                id="n8"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                8
              </div>
              <div
                @click="append('9')"
                id="n9"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                9
              </div>
              <div
                @click="times"
                id="times"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg operator"
              >
                *
              </div>
              <div
                @click="append('4')"
                id="n4"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                4
              </div>
              <div
                @click="append('5')"
                id="n5"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                5
              </div>
              <div
                @click="append('6')"
                id="n6"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                6
              </div>
              <div
                @click="minus"
                id="minus"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg operator"
              >
                -
              </div>
              <div
                @click="append('1')"
                id="n1"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                1
              </div>
              <div
                @click="append('2')"
                id="n2"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                2
              </div>
              <div
                @click="append('3')"
                id="n3"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                3
              </div>
              <div
                @click="plus"
                id="plus"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg operator"
              >
                +
              </div>
              <div
                @click="append('0')"
                id="n0"
                class="col-span-2 flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                0
              </div>
              <div
                @click="dot"
                id="dot"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
              >
                .
              </div>
              <div
                @click="equal"
                id="equal"
                class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg operator"
              >
                =
              </div>
            </div>
          </div>
        </CardBox>
        <div class="h-10 bg-red-600 col-span-3"></div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
