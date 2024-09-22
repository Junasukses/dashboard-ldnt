import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useMainStore } from '@/stores/main.js'
import vSelect from 'vue-select'
import vClickOutside from 'v-click-outside'
import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import './css/main.css'
import Icon from './components/Icon.vue'
import ColFilter from './components/forms/ColFilter.vue'
import { VueFinalModal } from 'vue-final-modal'

// Init Pinia
const pinia = createPinia()

// Create Vue app
library.add(fas, fab)
const app = createApp(App)
app.use(router)
app.use(pinia)

app.component('v-select', vSelect)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.component('Icon', Icon)
app.component('ColFilter', ColFilter)
app.component('VueFinalModal', VueFinalModal)

app.use(vClickOutside)
app.mount('#app')
app.provide('icon', icon)
// Init main store
const mainStore = useMainStore(pinia)

// Fetch sample data
mainStore.fetchSampleClients()
mainStore.fetchSampleHistory()

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
