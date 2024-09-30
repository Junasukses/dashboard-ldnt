<script setup>
import { reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import axios from 'axios'

const form = reactive({})

const router = useRouter()
const store = inject('store')

const submit = async () => {
  try {
    const response = await axios.post('/login', {
      email: form.email,
      password: form.password
    })

    const userValue = response.data

    localStorage.setItem('user', userValue)
    // window.localStorage.user = JSON.stringify(userValue)
    localStorage.setItem('token', userValue.token)
    store.user = userValue.data
    store.token = userValue.token

    router.push('/')
  } catch (error) {
    const errorMessage = error.response?.data || 'Login failed. Please try again.'
    alertify.error(errorMessage)
  }
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="Login" help="Please enter your login">
          <FieldX
            :bind="{ readonly: false }"
            class="!mt-0"
            :value="form.email"
            @input="(v) => (form.email = v)"
            placeholder="Email / Username"
            fa-icon="user"
            :check="false"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FieldX
            :bind="{ readonly: false }"
            type="password"
            class="!mt-0"
            :value="form.password"
            @input="(v) => (form.password = v)"
            placeholder="Password"
            fa-icon="lock"
            :check="false"
          />
        </FormField>
        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Login" small />
            <BaseButton to="/" color="info" outline label="Back" small />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
