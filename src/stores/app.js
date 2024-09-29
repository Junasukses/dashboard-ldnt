import { defineStore } from 'pinia'
import { themes } from '@/themes'

export const useStore = defineStore({
  id: 'app',
  state: () => ({
    title: null,
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    isPWA: ['fullscreen', 'standalone', 'minimal-ui'].some(
      (displayMode) => window.matchMedia('(display-mode: ' + displayMode + ')').matches
    ),
    isUsingLayout: true,
    canMobile: false,
    user: null,
    userWasRefreshed: false,
    alert: null,
    alertType: 'success',
    alertConfirm: 'Mengerti',
    captureImage: null,
    menu: [],
    currentMenu: {},
    isRequesting: false,
    templates: {},
    styles: {},
    server: import.meta.env.VITE_API_URL,
    isOnline: false,
    authenticate_every_page: false,
    loadedLandingTable: {},
    fcm_token: null,
    basePath: import.meta.env.VITE_BASE_PATH || '/',
    isFullScreen: false,
    realWidth: window.innerWidth,
    realHeight: window.innerHeight,
    publicPaths: [
      'not-found',
      'unauthenticated',
      'developer-testing',
      'runtime',
      'suspended',
      'login',
      'register',
      'reset-password',
      'previewer',
      'lock-screen',
      'google-login'
    ],
    staticPaths: [
      'not-found',
      'unauthenticated',
      'developer-testing',
      'runtime',
      'suspended',
      'previewer',
      'lock-screen',
      'index'
    ],
    hasConnected: false,
    chatRooms: [],
    chatMessages: [],
    isDeveloperContactEnable: false,
    isChatEnable: true,
    isChatOpen: false,
    isNoteOpen: false,
    previewIsOpen: false,
    previewSrc: null,
    server_command: null,
    isSWregistered: false,
    deferredPrompt: null,
    isMenuFetching: false,
    fetchInstance: null,
    notificationMenu: {
      // 'Persetujuan' : 15
    },
    wss: null,
    wssMessages: [],
    wssMessageLast: null,
    wssEndpointRefresh: [],
    beforeLockRoute: null,
    isLockingScreen: false,
    themeSelected: 'default',
    themes,
    mustReloadTemplates: [],
    loadedTemplates: []
  }),
  actions: {
    commit(command, val) {
      this[val[0]] = val[1]
    },
    setRequesting(status) {
      this.isRequesting = status
    }
  }
})
