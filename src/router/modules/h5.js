

import Layout from '@/view/layout/Layout'
const h5Router = {
  path: '/h5',
  component: Layout,
  alwaysShow: true,
  redirect: '/h5/vip-list',
  name:'h5',
  title: 'title',
  children: [
    {
      path: 'vip-list',
      component: () => import('@/view/h5/vip-list'),
      meta: {
        title: '人员名单'
      }
    },
  ]
}
export default h5Router
