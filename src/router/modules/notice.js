

import Layout from '@/view/layout/Layout'
const noticeRouter = {
  path: '/notice',
  component: Layout,
  alwaysShow: true,
  redirect: '/notice/notice-list',
  name:'notice',
  title: 'title',
  children: [
    {
      path: 'notice-list',
      component: () => import('@/view/notice/notice-list'),
      meta: {
        title: '公告列表'
      }
    },
    {
      path: 'notice-list/add-notice',
      component: () => import('@/view/notice/add-notice'),
      meta: {
        title: '公告增改'
      }
    },
  ]
}
export default noticeRouter
