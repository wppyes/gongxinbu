

import Layout from '@/view/layout/Layout'
const serviceRouter = {
  path: '/service',
  component: Layout,
  alwaysShow: true,
  redirect: '/service/advise',
  name:'service',
  title: 'title',
  children: [
    {
      path: 'advise',
      component: () => import('@/view/service/advise'),
      meta: {
        title: '意见反馈'
      }
    },
    {
      path: 'advise/huifu',
      component: () => import('@/view/service/huifu'),
      meta: {
        title: '反馈详情'
      }
    },
  ]
}
export default serviceRouter
