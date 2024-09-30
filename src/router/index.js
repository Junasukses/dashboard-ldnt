import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
import axios from 'axios'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Home,
    meta: {
      title: 'Dashboard'
    }
  },
  {
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/FormsView.vue'),
    meta: {
      title: 'Forms'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      title: 'Profile'
    }
  },
  {
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue'),
    meta: {
      title: 'UI'
    }
  },
  {
    path: '/responsive',
    name: 'responsive',
    component: () => import('@/views/ResponsiveView.vue'),
    meta: {
      title: 'Responsive Layout'
    }
  },
  {
    path: '/pos',
    name: 'pos',
    component: () => import('@/views/PosView.vue'),
    meta: {
      title: 'POS Pembayaran'
    }
  },
  {
    path: '/pos-landing',
    name: 'pos-landing',
    component: () => import('@/views/PosLandingView.vue'),
    meta: {
      title: 'POS Landing'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/master-unit',
    name: 'master-unit',
    component: () => import('@/views/master/MasterUnitLanding.vue'),
    meta: {
      title: 'Satuan Barang'
    }
  },
  {
    path: '/master-unit/:id',
    name: 'master-unit-id',
    component: () => import('@/views/master/MasterUnitForm.vue'),
    meta: {
      title: 'Satuan Barang'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')

  if (token) {
    try {
      await axios.get('/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (to.name === 'login') {
        return next({ name: 'dashboard' })
      }
    } catch (error) {
      localStorage.removeItem('token')
      return next({ name: 'login' })
    }
  }
  if (!token && to.name !== 'login') {
    return next({ name: 'login' })
  }
  next()
})

export default router
