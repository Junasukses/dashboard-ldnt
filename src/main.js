import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useMainStore, downloadBlob } from '@/stores/main.js'
import vSelect from 'vue-select'
import vClickOutside from 'v-click-outside'
import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import Popper from 'vue3-popper'

import './css/main.css'
import Icon from './components/Icon.vue'
import ColFilter from './components/forms/ColFilter.vue'
import { VueFinalModal } from 'vue-final-modal'
import FieldSelect from '@/components/forms/FieldSelect.vue'
import FieldPopup from '@/components/forms/FieldPopup.vue'
import TableApi from '@/components/forms/TableApi.vue'
import FieldUpload from '@/components/forms/FieldUpload.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FieldX from '@/components/forms/FieldX.vue'
import FieldNumber from '@/components/forms/FieldNumber.vue'
import IconTimes from '@/components/IconTimes.vue'
import IconSearch from '@/components/IconSearch.vue'
import '@/plugins/helper.js'
import { useStore } from '@/stores/app'
// Alertify
import alertify from 'alertifyjs'
window.alertify = alertify

// Init Pinia
const pinia = createPinia()

// Create Vue app
library.add(fas, fab)
const app = createApp(App)
app.use(router)
app.use(pinia)

app.component('CardBox', CardBox)
app.component('SectionMain', SectionMain)
app.component('LayoutAuthenticated', LayoutAuthenticated)
app.component('v-select', vSelect)
app.component('FieldSelect', FieldSelect)
app.component('TableApi', TableApi)
app.component('FieldUpload', FieldUpload)
app.component('FieldPopup', FieldPopup)
app.component('Popper', Popper)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.component('Icon', Icon)
app.component('ColFilter', ColFilter)
app.component('VueFinalModal', VueFinalModal)
app.component('FieldX', FieldX)
app.component('FieldNumber', FieldNumber)
app.component('iconTimes', IconTimes)
app.component('iconSearch', IconSearch)

app.use(vClickOutside)
app.mount('#app')
app.provide('icon', icon)
app.provide('download', downloadBlob)
app.provide('store', useStore())
// Init main store
const mainStore = useMainStore(pinia)

// Fetch sample data
// mainStore.fetchSampleClients()
// mainStore.fetchSampleHistory()

// Dark mode
// Uncomment, if you'd like to restore persisted darkMode setting, or use `prefers-color-scheme: dark`. Make sure to uncomment localStorage block in src/stores/darkMode.js
// import { useDarkModeStore } from './stores/darkMode'

// const darkModeStore = useDarkModeStore(pinia)

// if (
//   (!localStorage['darkMode'] && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
//   localStorage['darkMode'] === '1'
// ) {
//   darkModeStore.set(true)
// }

// Default title tag
const defaultDocumentTitle = 'Admin One Vue 3 Tailwind'

// Set document title from route meta
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle
})
