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
  mdiReact
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
