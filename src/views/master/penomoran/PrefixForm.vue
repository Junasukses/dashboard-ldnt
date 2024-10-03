<script setup>
import { reactive, ref } from 'vue'
import { mdiBallotOutline } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { useRouter, useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { onBeforeMount } from 'vue'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const baseUrl = ref(import.meta.env.VITE_API_URL)
const token = ref(localStorage.getItem('token') ?? import.meta.env.VITE_AUTH_TOKEN)
const endpointApi = 'generate_code_type'
const landing_path = '/setting-penomoran?activeTab=2';

const mainStore = useMainStore()
const actionText = ref(route.params.id === 'create' ? 'Create' : route.query.action)
const formErrors = reactive({})
const values = reactive({
    is_active: 1
})

onBeforeMount(async () => {
    if (actionText.value === 'Create') return;
    try {
        const res = await axios.get(`${baseUrl.value}/operation/${endpointApi}/${route.params.id}`)

        if (res.status !== 200) throw new Error('Failed when trying to read data');
        const resData = res.data;
        for (const [key, value] of Object.entries(resData.data)) {
            values[key] = value;
        }
        values.is_active = values.is_active ? 1 : 0;
    } catch (err) {
        alertify.error('Failed to get data')
    }
})

async function onSave() {
    try {
        const hit_endpoint = `${baseUrl.value}/operation/${endpointApi}/${actionText.value === 'Edit' ? route.params.id : ''}`;
        console.log(hit_endpoint);
        const res = await axios({
            method: actionText.value === 'Edit' ? 'PUT' : 'POST',
            url: hit_endpoint,
            data: values,
            headers: { 'Content-Type': 'Application/json', authorization: `Bearer ${token.value}` }
        });

        if (res.status === 200) {
            router.replace(landing_path);
        }
    } catch (e) {
        for (const [key, value] of Object.entries(e.response.data.errors)) {
            formErrors[key] = value;
        }
        alertify.error(e.response.data.message);
    } finally {

    }
}

</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Setting Prefix Penomoran" main>
            </SectionTitleLineWithButton>
            <CardBox>
                <div class="grid grid-cols-3 gap-4">
                    <div>
                        <label class="block font-bold mb-2">Business Unit</label>
                        <FieldX :bind="{ readonly: true }" class="w-full !mt-0" :value="values['m_bu.name']"
                            :errorText="formErrors.m_bu_id ? 'failed' : ''" :check="false"
                            placeholder="Auto Generate by System" label="" />
                    </div>
                    <div>
                        <label class="block font-bold mb-2">Nama</label>
                        <FieldX :bind="{ readonly: !actionText }" class="w-full !mt-0" :value="values.name"
                            :errorText="formErrors.name ? 'failed' : ''" @input="(v) => (values.name = v)"
                            :hints="formErrors.name" placeholder="Masukkan Name" :check="false" label="" />
                    </div>
                    <div>
                        <label class="block font-bold mb-2">Tipe Prefix</label>
                        <FieldSelect :bind="{ disabled: !actionText, clearable: true }" class="w-full !mt-0"
                            :value="values.ref_type" @input="(v) => (values.ref_type = v)"
                            :errorText="formErrors.ref_type ? 'failed' : ''" :hints="formErrors.ref_type"
                            valueField="id" displayField="key" :options="['text', 'seq', 'day', 'month', 'year']"
                            :check="false" placeholder="Masukkan Status" label="" />
                    </div>
                    <div>
                        <label class="block font-bold mb-2">Value</label>
                        <FieldX :bind="{ readonly: !actionText }" class="w-full !mt-0" :value="values.value"
                            :errorText="formErrors.value ? 'failed' : ''" @input="(v) => (values.value = v)"
                            :hints="formErrors.value" placeholder="Masukkan Value" :check="false" label="" />
                    </div>
                    <div>
                        <label class="block font-bold mb-2">Status</label>
                        <FieldSelect :bind="{ disabled: !actionText, clearable: true }" class="w-full !mt-0"
                            :value="values.is_active" @input="(v) => (values.is_active = v)"
                            :errorText="formErrors.is_active ? 'failed' : ''" :hints="formErrors.is_active"
                            valueField="id" displayField="key" :options="[
                                { id: 1, key: 'Active' },
                                { id: 0, key: 'InActive' }
                            ]" :check="false" placeholder="Masukkan Status" label="" />
                    </div>
                </div>
                <template #footer>
                    <BaseButtons class="flex justify-end mt-4">
                        <BaseButton @click="router.replace(landing_path)" type="reset" color="danger" label="Kembali" />
                        <BaseButton v-show="actionText" @click="onSave" type="submit" color="success" label="Simpan" />
                    </BaseButtons>
                </template>
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
