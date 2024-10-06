<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { mdiLogout, mdiClose, mdiMinus, mdiPlus } from '@mdi/js'
import BaseIcon from '@/components/BaseIcon.vue'
import { getButtonColor } from '@/colors.js'
import OverlayLayer from './OverlayLayer.vue'

// Define props
const props = defineProps({
  menu: {
    type: Array,
    required: true
  },
  isAsideMobileExpanded: Boolean,
  isAsideLgActive: Boolean,
  isDropdownList: Boolean
})

// Emit events
const emit = defineEmits(['menu-click', 'aside-lg-close-click'])

// Toggle the dropdown state for menu items
const dropdownStates = ref({})

const toggleDropdown = (index) => {
  dropdownStates.value[index] = !dropdownStates.value[index]
}

// Check if the dropdown is open
const isDropdownOpen = (index) => {
  return dropdownStates.value[index] || false
}

// Handle menu clicks
const menuClick = (event, item, index) => {
  if (item.menu) {
    toggleDropdown(index)
  } else {
    emit('menu-click', event, item)
  }
}

// Logic for logout item
const logoutItem = computed(() => ({
  label: 'Logout',
  icon: mdiLogout,
  color: 'info',
  isLogout: true
}))

// Class computations
const hasColor = computed(() => (item) => item && item.color)

const asideMenuItemActiveStyle = computed(
  () => (item) => (hasColor.value(item) ? '' : 'aside-menu-item-active font-bold')
)

const componentClass = computed(() => (item) => [
  'py-3 text-sm',
  hasColor.value(item)
    ? getButtonColor(item.color, false, true)
    : 'aside-menu-item dark:text-slate-300 dark:hover:text-white hover:bg-gray-700/60 dark:hover:bg-slate-700',
  item.isActive ? 'font-bold' : ''
])

const hasDropdown = computed(() => (item) => !!item.menu)

const currentRoute = useRoute()

const menuWithActiveState = computed(() => {
  return props.menu.map((item) => {
    // Determine if any sub-item is active
    const subItemsActive = item.menu
      ? item.menu.some((subItem) => subItem.to === currentRoute.path)
      : false
    const isActive = item.to === currentRoute.path || subItemsActive // Main item is active if it matches or if any sub-item is active
    return {
      ...item,
      isActive
    }
  })
})
</script>

<template>
  <aside
    id="aside"
    class="w-60 fixed flex z-40 top-0 h-screen transition-position overflow-hidden"
    :class="[
      isAsideMobileExpanded ? 'left-0 lg:-left-60' : '-left-60 lg:left-0',
      { 'lg:hidden xl:flex': !isAsideLgActive }
    ]"
  >
    <div class="aside flex-1 flex flex-col overflow-hidden dark:bg-slate-900">
      <div class="aside-brand flex flex-row h-14 items-center justify-between dark:bg-slate-900">
        <div class="text-center flex-1 lg:text-left lg:pl-6 xl:text-center xl:pl-0">
          <b class="font-black">Dashboard</b>
        </div>
        <button
          class="hidden lg:inline-block xl:hidden p-3"
          @click.prevent="emit('aside-lg-close-click')"
        >
          <BaseIcon :path="mdiClose" />
        </button>
      </div>

      <!-- Menu -->
      <div
        class="flex-1 overflow-y-auto overflow-x-hidden aside-scrollbars dark:aside-scrollbars-[slate]"
      >
        <ul>
          <li v-for="(item, index) in menuWithActiveState" :key="index">
            <component
              :is="item.to ? RouterLink : 'a'"
              :to="item.to ?? null"
              :href="item.href ?? null"
              :target="item.target ?? null"
              class="flex cursor-pointer items-center"
              :class="componentClass(item)"
              @click.prevent="menuClick($event, item, index)"
            >
              <BaseIcon
                v-if="item.icon"
                :path="item.icon"
                class="flex-none"
                :class="[item.isActive ? asideMenuItemActiveStyle(item) : '']"
                w="w-12"
              />
              <span
                class="grow"
                :class="[item.isActive ? asideMenuItemActiveStyle(item) : '']"
                style="overflow: hidden; text-overflow: ellipsis; display: block"
              >
                {{ item.label }}
              </span>
              <BaseIcon
                v-if="hasDropdown(item)"
                :path="isDropdownOpen(index) ? mdiMinus : mdiPlus"
                class="flex-none"
                :class="[item.isActive ? asideMenuItemActiveStyle(item) : '']"
                w="w-12"
              />
            </component>
            <ul
              v-if="hasDropdown(item)"
              :class="[isDropdownOpen(index) ? 'block' : 'hidden', 'aside-menu-dropdown']"
            >
              <li v-for="(subItem, subIndex) in item.menu" :key="subIndex">
                <component
                  :is="subItem.to ? RouterLink : 'a'"
                  :to="subItem.to ?? null"
                  :href="subItem.href ?? null"
                  :target="subItem.target ?? null"
                  class="flex cursor-pointer py-3 pl-2 text-sm dark:hover:bg-slate-700 hover:bg-gray-700/60 text-[#d1e5db] items-center"
                  :class="{
                    'bg-gray-700/50 text-white font-bold': currentRoute.path === subItem.to
                  }"
                  @click.prevent="menuClick($event, subItem, subIndex)"
                >
                  <BaseIcon
                    v-if="subItem.icon"
                    :path="subItem.icon"
                    class="flex-none"
                    w="w-12"
                    :class="{
                      'text-blue-500': currentRoute.path === subItem.to
                    }"
                  />
                  <span
                    class="grow"
                    style="overflow: hidden; text-overflow: ellipsis; display: block"
                  >
                    {{ subItem.label }}
                  </span>
                  <!-- Allow text to wrap -->
                </component>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <OverlayLayer
      v-show="isAsideLgActive"
      z-index="z-30"
      @overlay-click="emit('aside-lg-close-click')"
    />
  </aside>
</template>

<!-- <script setup>
import AsideMenuLayer from '@/components/AsideMenuLayer.vue'
import OverlayLayer from '@/components/OverlayLayer.vue'

defineProps({
  menu: {
    type: Array,
    required: true
  },
  isAsideMobileExpanded: Boolean,
  isAsideLgActive: Boolean
})

const emit = defineEmits(['menu-click', 'aside-lg-close-click'])

const menuClick = (event, item) => {
  emit('menu-click', event, item)
}

const asideLgCloseClick = (event) => {
  emit('aside-lg-close-click', event)
}
</script>

<template>
  <AsideMenuLayer
    :menu="menu"
    :class="[
      isAsideMobileExpanded ? 'left-0 lg:-left-60' : '-left-60 lg:left-0',
      { 'lg:hidden xl:flex': !isAsideLgActive }
    ]"
    @menu-click="menuClick"
    @aside-lg-close-click="asideLgCloseClick"
  />
  <OverlayLayer v-show="isAsideLgActive" z-index="z-30" @overlay-click="asideLgCloseClick" />
</template> -->
