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
            <h2 class="text-xl font-semibold mb-2 text-center">Halaman Pembayaran</h2>
            <hr>
            <div class="grid grid-cols-3 gap-x-4 p-4">
                <div class="col-span-2">
                    <div class="grid grid-cols-12 gap-[12px] h-[400px]">
                        <div class="col-span-2 space-y-[12px]">
                            <div
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            10.000
                            </div>
                            <div
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            50.000
                            </div>

                            <div
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            100.000
                            </div>

                            <div
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            500.000
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-[12px] col-span-10">
                            <div
                            id="n7"
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            7
                            </div>
                            <div
                            id="n8"
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            8
                            </div>
                            <div
                            id="n9"
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            9
                            </div>
                            <div
                            id="n4"
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            4
                            </div>
                            <div
                            id="n5"
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            5
                            </div>
                            <div
                            id="n6"
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            6
                            </div>
                            <div
                            id="n1"
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            1
                            </div>
                            <div
                            id="n2"
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            2
                            </div>
                            <div
                            id="n3"
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            3
                            </div>

                            <div
                            id="equal"
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg operator"
                            >
                            C
                            </div>

                            <div
                            id="n0"
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg"
                            >
                            0
                            </div>
                            <div
                            id="equal"
                            class="flex items-center justify-center cursor-pointer text-center bg-white font-semibold border border-[#c6d8da] text-[#484848] hover:bg-[#086968] hover:text-white transition duration-150 rounded-md outline-none py-4 text-lg operator"
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
                            <FieldNumber :bind="{readonly: true}" :value="prop.data?.netto" :check="false" class="w-1/2 !mt-0"/>
                        </div>
                        <div class="flex">
                            <label class="w-[200px]">Diskon</label>
                            <FieldNumber :bind="{readonly: true}" :value="prop.data?.amt_disc" :check="false" class="w-1/2 !mt-0"/>
                        </div>
                        <div class="text-right">
                            <label class="w-[200px]">Total Yang Harus Dibayarkan</label>
                            <h4 class="font-bold text-3xl">Rp. {{formatNumber(prop.data?.netto)}}</h4>
                        </div>
                        <div class="flex">
                            <label class="w-[200px]">Jumlah Bayar</label>
                            <FieldNumber :bind="{readonly: true}" :value="data.amt_pay" :check="false" class="w-1/2 !mt-0"/>
                        </div>
                        <div class="flex">
                            <label class="w-[200px]">Sisa</label>
                            <FieldNumber :bind="{readonly: true}" :value="data.sisa" :check="false" class="w-1/2 !mt-0"/>
                        </div>
                        <div class="flex">
                            <label class="w-[230px]">Jml Donasi</label>
                            <FormCheckRadio v-model="isDonasiManual" name="form radio" inputValue="tes"/>
                            <FieldNumber :bind="{readonly: true}" :value="data.amt_donation" :check="false" class="w-1/2 !mt-0"/>
                        </div>
                        <div class="flex">
                            <label class="w-[100px]">Kembali</label>
                            <FieldNumber :bind="{readonly: true}" :value="data.amt_change" :check="false" class="w-1/2 !mt-0"/>
                        </div>
                        <div class="flex justify-between items-center mt-2">
                <h1 class="font-semibold">Pilih Metode Pembayaran</h1>
              </div>
              <div class="flex items-stretch text-sm bg-[#f4f4f4] gap-2 rounded-lg">
                <button
                  class="w-full flex items-center justify-center text-gray-600 hover:bg-[#086968] rounded-lg duration-300 
                  hover:text-white"
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
                  style="cursor: pointer;" class="bg-blue-600 hover:bg-[#086968] text-white w-full h-full text-center py-2 text-[13px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
                >
                  <button class="flex flex-col items-center justify-center">
                    <BaseIcon :path="mdiContentSave" size="20" />Simpan
                  </button>
                </div>
                <div
                  style="cursor: pointer;" class="bg-green-600 hover:bg-green-700 text-white w-full h-full text-center py-2 text-[13px] font-semibold rounded-lg flex items-center justify-center max-h-[120px]"
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

        
    const prop = defineProps({
        data: {
            type: Object,
            default: ()=>{}
        }
    });

    function open(){
        isOpenPopup.value = true
    }
    
    defineExpose({
        open
    })

    const change = computed(()=>{
        const total = prop.data?.netto - data.amt_pay
        data.change = parseFloat(total);
        return data.change;
    })
    const amt_change = computed(()=>{
        const total = data?.change - data.amt_donation
        data.amt_change = parseFloat(total);
        return data.amt_change;
    })

    function formatNumber(amount, decimals = 2) {
        if (isNaN(amount)) {
        return '';
        }
        amount = amount ? Number(amount) : 0
        const roundedAmount = amount.toFixed(decimals);
        const [integerPart, decimalPart] = roundedAmount.split('.');
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return `${formattedIntegerPart}${decimalPart ? ',' + decimalPart : ''}`;
        
    }

</script>
