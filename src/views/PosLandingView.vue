<script setup>
import BaseIcon from '@/components/BaseIcon.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormControl from '@/components/FormControl.vue'
import IconRounded from '@/components/IconRounded.vue'
import NavBar from '@/components/NavBar.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import {
  mdiAccountGroup,
  mdiAccountGroupOutline,
  mdiBackspace,
  mdiBallotOutline,
  mdiCash,
  mdiContentSave,
  mdiCreditCard,
  mdiLineScan,
  mdiListBoxOutline,
  mdiMinus,
  mdiNote,
  mdiPlus,
  mdiPrinter,
  mdiSaleOutline,
  mdiTrashCan
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
        <div class="grid grid-cols-12 gap-[12px]">
          <div class="col-span-9">
            <h1 class="ml-2 mb-6 font-bold text-2xl">Selamat Datang Admin</h1>
            <div class="flex flex-wrap items-center space-x-4">
              <div
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
              </div>
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
                <span class="ml-2">List Member</span>
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
                <span class="ml-2">List Diskon</span>
              </div>
              <div
                class="flex items-center p-2 rounded-lg font-semibold shadow-md cursor-pointer duration-300 transition"
                :class="
                  activeTabIndex == 3
                    ? 'text-white bg-[#086968]'
                    : 'text-gray-600 hover:bg-gray-100 bg-white'
                "
                @click="activeTabIndex = 3"
              >
                <BaseIcon :path="mdiCash" size="20" />
                <span class="ml-2">Pembayaran</span>
              </div>
            </div>
            <CardBox class="mt-4">
              <div class="flex items-center justify-between font-semibold mb-6">
                <div class="flex items-center space-x-2">
                  <h1>Kode Item</h1>
                  <FormControl v-model="form.name" class="w-[50%] !h-[10%]" />
                </div>

                <div class="flex items-center space-x-2">
                  <h1>Pilih Member</h1>
                  <FormControl v-model="form.name" class="w-[50%] !h-[10%]" />
                </div>

                <div class="flex items-center space-x-2">
                  <h1>Grand Total</h1>
                  <FormControl v-model="form.name" class="w-[50%] !h-[10%]" />
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
                      <th scope="col" class="px-6 py-3">Harga</th>
                      <th scope="col" class="px-6 py-3">Qty</th>
                      <th scope="col" class="px-6 py-3">Disc (%)</th>
                      <th scope="col" class="px-6 py-3">Disc (Rp)</th>
                      <th scope="col" class="px-6 py-3">Sub Total</th>
                      <th scope="col" class="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-white border-b dark:border-gray-700">
                      <td class="px-6 py-3">1</td>
                      <td class="px-6 py-3">Beras 5Kg</td>
                      <td class="px-6 py-3">60.000</td>
                      <td class="px-6 py-3">
                        <div class="flex items-center justify-around">
                          <BaseButton color="black" :icon="mdiMinus" small :rounded-full="true" />
                          <span>1</span>

                          <BaseButton color="black" :icon="mdiPlus" small :rounded-full="true" />
                        </div>
                      </td>
                      <td class="px-6 py-3">5%</td>
                      <td class="px-6 py-3">3000</td>
                      <td class="px-6 py-3">57.000</td>

                      <td class="px-6 py-3">
                        <BaseButtons type="justify-center" no-wrap>
                          <BaseButton color="danger" :icon="mdiTrashCan" small />
                        </BaseButtons>
                      </td>
                    </tr>
                    <tr class="bg-white border-b dark:border-gray-700">
                      <td class="px-6 py-3">2</td>
                      <td class="px-6 py-3">Minyak Goreng 2L</td>
                      <td class="px-6 py-3">30.000</td>
                      <td class="px-6 py-3">
                        <div class="flex items-center justify-around">
                          <BaseButton color="black" :icon="mdiMinus" small :rounded-full="true" />
                          <span>1</span>

                          <BaseButton color="black" :icon="mdiPlus" small :rounded-full="true" />
                        </div>
                      </td>
                      <td class="px-6 py-3">2%</td>
                      <td class="px-6 py-3">600</td>
                      <td class="px-6 py-3">29.400</td>

                      <td class="px-6 py-3">
                        <BaseButtons type="justify-center" no-wrap>
                          <BaseButton color="danger" :icon="mdiTrashCan" small />
                        </BaseButtons>
                      </td>
                    </tr>
                    <tr class="bg-white border-b dark:border-gray-700">
                      <td class="px-6 py-3">3</td>
                      <td class="px-6 py-3">Deterjen Bubuk 1Kg</td>
                      <td class="px-6 py-3">15.000</td>
                      <td class="px-6 py-3">
                        <div class="flex items-center justify-around">
                          <BaseButton color="black" :icon="mdiMinus" small :rounded-full="true" />
                          <span>2</span>
                          <BaseButton color="black" :icon="mdiPlus" small :rounded-full="true" />
                        </div>
                      </td>
                      <td class="px-6 py-3">0</td>
                      <td class="px-6 py-3">0</td>
                      <td class="px-6 py-3">30.000</td>
                      <td class="px-6 py-3">
                        <BaseButtons type="justify-center" no-wrap>
                          <BaseButton color="danger" :icon="mdiTrashCan" small />
                        </BaseButtons>
                      </td>
                    </tr>

                    <tr class="bg-white border-b dark:border-gray-700">
                      <td class="px-6 py-3">4</td>
                      <td class="px-6 py-3">Susu UHT 1L</td>
                      <td class="px-6 py-3">20.000</td>
                      <td class="px-6 py-3">
                        <div class="flex items-center justify-around">
                          <BaseButton color="black" :icon="mdiMinus" small :rounded-full="true" />
                          <span>4</span>

                          <BaseButton color="black" :icon="mdiPlus" small :rounded-full="true" />
                        </div>
                      </td>
                      <td class="px-6 py-3">2%</td>
                      <td class="px-6 py-3">400</td>
                      <td class="px-6 py-3">79.600</td>

                      <td class="px-6 py-3">
                        <BaseButtons type="justify-center" no-wrap>
                          <BaseButton color="danger" :icon="mdiTrashCan" small />
                        </BaseButtons>
                      </td>
                    </tr>
                    <tr class="bg-white border-b dark:border-gray-700">
                      <td class="px-6 py-3">5</td>
                      <td class="px-6 py-3">Pasta Gigi 120gr</td>
                      <td class="px-6 py-3">20.000</td>
                      <td class="px-6 py-3">
                        <div class="flex items-center justify-around">
                          <BaseButton color="black" :icon="mdiMinus" small :rounded-full="true" />
                          <span>2</span>

                          <BaseButton color="black" :icon="mdiPlus" small :rounded-full="true" />
                        </div>
                      </td>
                      <td class="px-6 py-3">0</td>
                      <td class="px-6 py-3">0</td>
                      <td class="px-6 py-3">40.000</td>

                      <td class="px-6 py-3">
                        <BaseButtons type="justify-center" no-wrap>
                          <BaseButton color="danger" :icon="mdiTrashCan" small />
                        </BaseButtons>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBox>
          </div>

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

              <div class="flex flex-col py-2 space-y-2">
                <div class="flex justify-between font-semibold">
                  <h1>Total</h1>
                  <h1>236.000</h1>
                </div>

                <div class="flex justify-between font-semibold">
                  <h1>Bayar</h1>
                  <h1>250.000</h1>
                </div>

                <div class="flex justify-between font-semibold">
                  <h1>Kembali</h1>
                  <h1>14.000</h1>
                </div>
              </div>

              <BaseButton
                label="Trigger"
                to="/pos"
                color="success"
                small
                class="w-full mt-4 py-2 !bg-[#086968] hover:!bg-[#075e5d]"
              />
            </CardBox>
          </div>
        </div>
      </SectionMain>
    </div>
  </div>
</template>
