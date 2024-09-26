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
import { ref, reactive } from 'vue'
import menuNavBar from '@/menuNavBar.js'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'

const activeTabIndex = ref(0)

const form = reactive({})
</script>

<template>
  <div class="overflow-hidden lg:overflow-visible">
    <div
      class="lg:ml-0 pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100"
    >
      <NavBar :menu="menuNavBar" class="ml-60 lg:ml-0 xl:pl-60"> </NavBar>
      <SectionMain class="!py-0 overflow-hidden">
        <h1 class="ml-2 mb-4 font-bold text-2xl">Halaman Pembayaran</h1>
        <div class="grid grid-cols-12 gap-[12px]">
          <div class="row-span-2 col-span-3 text-[12px] h-full">
            <CardBox class="h-full">
              <h1 class="font-bold text-center text-xl">Detail Nota</h1>
              <div class="flex justify-between items-center py-2 border-t border-b my-4">
                <div>
                  <span>List Order</span>
                </div>
                <div>
                  <span>Kamis, 14 Oktober 2024</span>
                </div>
              </div>
              <div class="flex flex-col border-b">
                <div class="flex justify-between font-semibold">
                  <h1>Beras 5Kg</h1>
                  <h1>60.000</h1>
                </div>
                <div class="flex my-2">
                  <h1 class="mr-2">x1</h1>
                  <h1>Disc 3.000</h1>
                </div>

                <div class="flex justify-between font-semibold">
                  <h1>Minyak Goreng 5L</h1>
                  <h1>30.000</h1>
                </div>
                <div class="flex my-2">
                  <h1 class="mr-2">x1</h1>
                  <h1>Disc 600</h1>
                </div>
                <div class="flex justify-between font-semibold">
                  <h1>Detergen Bubuk 1Kg</h1>
                  <h1>30.000</h1>
                </div>
                <div class="flex my-2">
                  <h1 class="mr-2">x1</h1>
                </div>
                <div class="flex justify-between font-semibold">
                  <h1>Susu UHT 1L</h1>
                  <h1>80.000</h1>
                </div>
                <div class="flex my-2">
                  <h1 class="mr-2">x4</h1>
                  <h1>Disc 400</h1>
                </div>
              </div>

              <div class="flex flex-col border-b py-2 space-y-2">
                <div class="flex justify-between font-semibold">
                  <h1>Sub Total</h1>
                  <h1>40.000</h1>
                </div>
                <div class="flex justify-between font-semibold">
                  <h1>Discount</h1>
                  <h1>4.000</h1>
                </div>
                <div class="flex justify-between font-semibold">
                  <h1>Pajak</h1>
                  <h1>0</h1>
                </div>
              </div>
              <div class="flex justify-between font-semibold py-2">
                <h1>Total Harus Bayar</h1>
                <h1>236.000</h1>
              </div>
            </CardBox>
          </div>
          <!-- Info Nota -->
          <div class="col-span-6 text-[13px] h-full">
            <CardBox>
              <div class="grid grid-cols-2 gap-2">
                <table>
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
                  </tbody>
                </table>

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
                      <td class="align-top !border-0 p-0">Jl. Soekarno Hatta No. 45</td>
                    </tr>
                    <tr class="!bg-white">
                      <td class="whitespace-normal align-top !border-0 p-0 w-[10%]">Point</td>
                      <td class="whitespace-normal align-top !border-0 p-0 px-1 w-[1%]">:</td>
                      <td class="whitespace-normal align-top !border-0 p-0">35</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBox>
          </div>

          <CardBox class="col-span-3 row-span-2">
            <div class="flex flex-col text-[13px] gap-2">
              <div class="flex justify-between items-center">
                <h1>Total Belanja</h1>
                <FormControl v-model="form.name" class="w-[50%] !h-[10%]" />
              </div>

              <div class="flex justify-between items-center">
                <h1>Diskon</h1>
                <FormControl v-model="form.diskon" class="w-[50%] !h-[10%]" />
              </div>
              <div class="font-bold">
                <h1>Total Yang Harus Dibayarkan</h1>
                <h1 class="text-2xl">Rp. 236.300</h1>
              </div>

              <div class="flex justify-between items-center">
                <h1>Jml Bayar</h1>
                <FormControl v-model="form.diskon" class="w-[50%] !h-[10%]" />
              </div>
              <div class="flex justify-between items-center">
                <h1>Sisa</h1>
                <FormControl v-model="form.diskon" class="w-[50%] !h-[10%]" />
              </div>

              <div class="flex space-x-[18%] items-center">
                <h1>Masukan Donasi</h1>
                <FormCheckRadio v-model="form.radio" />
              </div>

              <div class="flex justify-between items-center">
                <h1>Jml Donasi</h1>
                <FormControl v-model="form.diskon" class="w-[50%] !h-[10%]" />
              </div>
              <div class="flex justify-between items-center">
                <h1>Kembali</h1>
                <FormControl v-model="form.diskon" class="w-[50%] !h-[10%]" />
              </div>

              <div class="flex justify-between items-center mt-2">
                <h1 class="font-semibold">Pilih Metode Pembayaran</h1>
              </div>
              <div class="flex items-stretch text-sm">
                <button
                  class="w-full flex items-center justify-center bg-[#f4f4f4] rounded-tl-lg text-gray-600 hover:bg-[#086968] hover:rounded-lg duration-300 hover:text-white"
                  :class="{ ' text-white font-bold': activeTabIndex === 0 }"
                  @click="activeTabIndex = 0"
                >
                  <div
                    class="w-full h-full flex items-center justify-center p-3"
                    :class="{ 'rounded-lg bg-[#086968]': activeTabIndex == 0 }"
                  >
                    <BaseIcon :path="mdiCash" size="80" />
                  </div>
                </button>
                <button
                  class="w-full flex items-center justify-center bg-[#f4f4f4] text-gray-600 duration-300"
                  :class="{ 'text-white font-bold': activeTabIndex === 1 }"
                  @click="activeTabIndex = 1"
                >
                  <div
                    class="w-full h-full flex items-center justify-center bg-none p-3 hover:bg-[#086968] hover:rounded-lg duration-300 hover:text-white"
                    :class="{ 'rounded-lg bg-[#086968]': activeTabIndex == 1 }"
                  >
                    <BaseIcon :path="mdiCreditCard" size="80" />
                  </div>
                </button>
                <button
                  class="w-full flex items-center justify-center border-b-2 bg-[#f4f4f4] rounded-tr-lg hover:bg-[#086968] hover:rounded-lg duration-300 hover:text-white"
                  :class="{ 'text-white font-bold': activeTabIndex === 2 }"
                  @click="activeTabIndex = 2"
                >
                  <div
                    class="w-full h-full flex items-center justify-center bg-none p-3"
                    :class="{ 'rounded-lg bg-[#086968]': activeTabIndex == 2 }"
                  >
                    <BaseIcon :path="mdiLineScan" />
                  </div>
                </button>
              </div>
              <div class="flex items-center space-x-2 mt-3">
                <div
                  class="bg-blue-600 hover:bg-blue-700 text-white w-full h-full text-center py-2 text-[13px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
                >
                  <button class="flex flex-col items-center justify-center">
                    <BaseIcon :path="mdiContentSave" size="20" />Simpan
                  </button>
                </div>
                <div
                  class="bg-green-600 hover:bg-green-700 text-white w-full h-full text-center py-2 text-[13px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
                >
                  <button class="flex flex-col items-center justify-center">
                    <BaseIcon :path="mdiPrinter" size="20" />Simpan & Cetak
                  </button>
                </div>
              </div>
            </div>
          </CardBox>
          <CardBox class="col-span-6">
            <div class="grid grid-cols-12 gap-[12px]">
              <div class="col-span-2 space-y-[12px]">
                <div
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  10.000
                </div>
                <div
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  50.000
                </div>

                <div
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  100.000
                </div>

                <div
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  500.000
                </div>
              </div>
              <div class="grid grid-cols-3 gap-[12px] col-span-10">
                <div
                  id="n7"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  7
                </div>
                <div
                  id="n8"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  8
                </div>
                <div
                  id="n9"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  9
                </div>
                <div
                  id="n4"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  4
                </div>
                <div
                  id="n5"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  5
                </div>
                <div
                  id="n6"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  6
                </div>
                <div
                  id="n1"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  1
                </div>
                <div
                  id="n2"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  2
                </div>
                <div
                  id="n3"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  3
                </div>

                <div
                  id="equal"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg operator"
                >
                  C
                </div>

                <div
                  id="n0"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg"
                >
                  0
                </div>
                <div
                  id="equal"
                  class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#c6d8da] hover:text-white transition duration-300 rounded-md outline-none py-4 text-lg operator"
                >
                  <BaseIcon :path="mdiBackspace" />
                </div>
              </div>
            </div>
          </CardBox>
        </div>
      </SectionMain>
    </div>
  </div>
</template>
