<script setup>
import { mdiForwardburger, mdiBackburger, mdiMenu } from '@mdi/js'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import menuAside from '@/menuAside.js'
import menuNavBar from '@/menuNavBar.js'
import { useDarkModeStore } from '@/stores/darkMode.js'
import BaseIcon from '@/components/BaseIcon.vue'
import FormControl from '@/components/FormControl.vue'
import NavBar from '@/components/NavBar.vue'
import NavBarItemPlain from '@/components/NavBarItemPlain.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import FooterBar from '@/components/FooterBar.vue'
import { useStore } from '@/stores/app'

// const layoutAsidePadding = 'xl:pl-60'

const props = defineProps({
  withoutSidebar: {
    type: Boolean,
    default: false
  }
})
const darkModeStore = useDarkModeStore()

const router = useRouter()
const store = useStore()

const isAsideMobileExpanded = ref(false)
const isAsideLgActive = ref(false)

// const updateIsAsideMobileExpanded = computed(() => {
//   return props.withoutSidebar ? true : isAsideMobileExpanded.value
// })

// isAsideMobileExpanded.value = updateIsAsideMobileExpanded.value

router.beforeEach(() => {
  isAsideMobileExpanded.value = false
  isAsideLgActive.value = false
})

const menuClick = (event, item) => {
  if (item.isToggleLightDark) {
    darkModeStore.set()
  }

  if (item.isLogout) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    store.token = null
    store.user = null

    router.push({ name: 'login' })
  }
}
</script>

<template>
  <div
    :class="{
      'overflow-hidden lg:overflow-visible': isAsideMobileExpanded
    }"
  >
    <div
      :class="[{ 'ml-60 lg:ml-0': isAsideMobileExpanded, 'xl:pl-60': !isAsideMobileExpanded }]"
      class="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100"
    >
      <NavBar
        :menu="menuNavBar"
        :class="[{ 'ml-60 lg:ml-0': isAsideMobileExpanded, 'xl:pl-60': !isAsideMobileExpanded }]"
        @menu-click="menuClick"
      >
        <NavBarItemPlain
          display="flex"
          @click.prevent="isAsideMobileExpanded = !isAsideMobileExpanded"
        >
          <BaseIcon :path="isAsideMobileExpanded ? mdiBackburger : mdiForwardburger" size="24" />
        </NavBarItemPlain>
        <!-- <NavBarItemPlain display="hidden lg:flex " @click.prevent="isAsideLgActive = true">
            <BaseIcon :path="mdiMenu" size="24" />
          </NavBarItemPlain> -->
      </NavBar>
      <AsideMenu
        :is-aside-mobile-expanded="isAsideMobileExpanded"
        :is-aside-lg-active="isAsideLgActive"
        :menu="menuAside"
        @menu-click="menuClick"
        @aside-lg-close-click="isAsideLgActive = false"
      />
      <slot />
      <!-- <FooterBar> </FooterBar> -->
    </div>
  </div>
</template>
