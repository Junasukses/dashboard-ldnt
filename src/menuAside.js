import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette,
  mdiReact,
  mdiNumeric,
  mdiCodeArray,
  mdiNumeric0Box
} from '@mdi/js'

export default [
  {
    to: '/',
    icon: mdiMonitor,
    label: 'Dashboard'
  },
  {
    to: '/pos-landing',
    icon: mdiMonitor,
    label: 'POS'
  },
  {
    label: 'Setting Transaksi',
    icon: mdiViewList,
    menu: [
      {
        to: '/master-diskon',
        label: 'Diskon',
        icon: mdiSquareEditOutline
      },
      {
        to: '/setting-penomoran',
        label: 'Penomoran',
        icon: mdiNumeric
      }
    ]
  },
  {
    label: 'Overview',
    icon: mdiViewList,
    menu: [
      {
        to: '/forms',
        label: 'Forms',
        icon: mdiSquareEditOutline
      },
      {
        to: '/ui',
        label: 'UI',
        icon: mdiTelevisionGuide
      },
      {
        to: '/responsive',
        label: 'Responsive',
        icon: mdiResponsive
      }
    ]
  }
]
