

import Layout from '@/view/layout/Layout'
const activityRouter = {
  path: '/activity',
  component: Layout,
  alwaysShow: true,
  redirect: '/activity/list',
  name:'activity',
  title: 'title',
  children: [
    {
      path: 'activity-list',
      component: () => import('@/view/activity/activity-list'),
      meta: {
        title: '活动列表'
      }
    },
    {
      path: 'activity-list/add-activity',
      component: () => import('@/view/activity/add-activity'),
      meta: {
        title: '活动增改增改'
      }
    },
    {
      path: 'activity-list/activity-renyuan',
      component: () => import('@/view/activity/activity-renyuan'),
      meta: {
        title: '活动参与人员'
      }
    },
  ]
}
export default activityRouter
