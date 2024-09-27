<script setup>
import BaseIcon from '@/components/BaseIcon.vue'
import CardBox from '@/components/CardBox.vue'
import NavBar from '@/components/NavBar.vue'
import {
  mdiAccountGroupOutline,
  mdiCash,
  mdiListBoxOutline,
  mdiMinus,
  mdiPlus,
  mdiSaleOutline,
  mdiTrashCan
} from '@mdi/js'
import { ref, reactive } from 'vue'
import menuNavBar from '@/menuNavBar.js'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import FieldPopupKode from '@/components/FieldPopupKode.vue'

const baseUrl = ref(import.meta.env.VITE_API_URL);
const token = ref(localStorage.getItem('authToken'));
const activeTabIndex = ref(0);
const barcodeInput = ref();
const values = reactive({barcode: ''});
const form = reactive({});
const item = reactive({group_data: []});

function newDataItem(newData){
  const isData = item.group_data.filter(dt => dt.id === newData.id);
  if(isData.length === 0){
    item.group_data = [...item.group_data, {...newData, qty: 1, disc_percent: 0, disc_amount: 0, sub_total: newData.price}];
  } else {
    item.group_data = item.group_data.map(dt => {
      if(dt.id === newData.id){
        return {...dt, qty: dt.qty + 1, sub_total: dt.price * (dt.qty + 1)}
      } else {
        return dt;
      }
    })
  }
}

function onEnterBarcode(data) {
  console.log('Before Reset:', barcodeInput.value); // Debug
  newDataItem(data);
  setTimeout(() => {
    if (barcodeInput.value) {
      barcodeInput.value.onReset();
    }
    values.barcode = '';
  }, 200);
}

function changeQty(type, id){
  item.group_data = item.group_data.map(dt => {
    if(dt.id === id){
        if(type === 'plus'){
          return {...dt, qty: dt.qty + 1, sub_total: dt.price * (dt.qty + 1)}
        } else if (type === 'min'){
          return {...dt, qty: dt.qty - 1, sub_total: dt.price * (dt.qty - 1)}
        } else {
          return dt;
        }
      } else {
        return dt;
      }
  })

  item.group_data = item.group_data.filter(dt => dt.qty > 0);
}

function deleteItem(id){
  item.group_data = item.group_data.filter(dt => dt.id !== id)
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
      class="lg:ml-0 pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100"
    >
      <NavBar :menu="menuNavBar" class="ml-60 lg:ml-0 xl:pl-60"> </NavBar>
      <SectionMain class="!py-0 overflow-hidden">
        <div class="grid grid-cols-12 gap-[12px]">
          <div class="col-span-9">
            <h1 class="!ml-2 !mb-4 !font-bold !text-2xl">Selamat Datang Admin</h1>
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
                <div class="flex justify-between items-center space-x-6">
                  <h2 style="text-wrap: nowrap;">Kode Item</h2>
                  <FieldPopupKode 
                  ref="barcodeInput"
                  :value="values.barcode" @input="(v)=>values.barcode=v"
                  :check="false"
                  @update:valueFull="onEnterBarcode"
                  valueField="id" displayField="barcode"
                  :api="{
                    url: `${baseUrl}/operation/v_item_catalog`,
                    headers: { 'Content-Type': 'Application/json', authorization: `Bearer ${token}`},
                    params: {
                      simplest:true,
                      searchfield: 'this.item_code, this.item_name, this.barcode'
                    }
                  }"
                  :columns="[{
                    headerName: 'No',
                    valueGetter:(p)=>p.node.rowIndex + 1,
                    width: 60,
                    sortable: false, resizable: false, filter: false,
                    cellClass: ['justify-center', 'bg-gray-50']
                  }, {
                    headerName: 'Kode',
                    field: 'item_code',
                    width: 60,
                    flex: 1,
                    sortable: true, resizable: true, filter: true,
                    cellClass: ['justify-center', 'bg-gray-50']
                  }, {
                    headerName: 'Nama',
                    field: 'item_name',
                    width: 60,
                    flex: 1,
                    sortable: true, resizable: true, filter: true,
                    cellClass: ['justify-center', 'bg-gray-50']
                  }, {
                    headerName: 'Barcode',
                    field: 'barcode',
                    width: 60,
                    flex: 1,
                    sortable: true, resizable: true, filter: true,
                    cellClass: ['justify-center', 'bg-gray-50']
                  },
                  ]"
                  class="!mt-0" />
                </div>

                <div class="flex items-center space-x-6">
                  <h2 style="text-wrap: nowrap;">Pilih Member</h2>
                  <FieldX :value="form.name"  @input="v => form.name = v" class="!mt-0" :check="false"/>
                </div>

                <div class="flex items-center space-x-6">
                  <h2 style="text-wrap: nowrap;">Grand Total</h2>
                  <FieldX :value="form.name"  @input="v => form.name = v" class="!mt-0" :check="false"/>
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
                    <tr v-if="item.group_data.length === 0">
                      <td colspan="8" class="h-20 w-full flex items-center justify-center !text-center">Belum ada item yang ditambahkan</td>
                    </tr>
                    <tr v-for="(dt, i) in item.group_data" :key="i" class="bg-white border-b dark:border-gray-700">
                      <td class="px-6 py-3">{{ i + 1 }}</td>
                      <td class="px-6 py-3">{{dt.item_name}}</td>
                      <td class="px-6 py-3">{{ dt.price }}</td>
                      <td class="px-6 py-3">
                        <div class="flex gap-2 items-center justify-around">
                          <BaseButton @click="changeQty('min',dt.id)" color="black" :icon="mdiMinus" small :rounded-full="true" />
                          <span>{{ dt.qty }}</span>

                          <BaseButton @click="changeQty('plus',dt.id)" color="black" :icon="mdiPlus" small :rounded-full="true" />
                        </div>
                      </td>
                      <td class="px-6 py-3">{{dt.disc_percent}}</td>
                      <td class="px-6 py-3">{{ dt.disc_amount }}</td>
                      <td class="px-6 py-3">{{ dt.sub_total }}</td>

                      <td class="px-6 py-3">
                        <BaseButtons type="justify-center" no-wrap>
                          <BaseButton @click="deleteItem(dt.id)" color="danger" :icon="mdiTrashCan" small />
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
                label="Pembayaran"
                to="/pos"
                small
                class="!text-white w-full mt-4 py-2 !bg-[#086968] hover:!bg-[#075e5d]"
              />
            </CardBox>
          </div>
        </div>
      </SectionMain>
    </div>
  </div>
</template>
