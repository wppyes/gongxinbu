

import Layout from '@/view/layout/Layout'
const newsRouter = {
  path: '/news',
  component: Layout,
  alwaysShow: true,
  redirect: '/news/news-list',
  name:'news',
  title: 'title',
  children: [
    {
      path: 'news-list',
      component: () => import('@/view/news/news-list'),
      meta: {
        title: '新闻列表'
      }
    },
    {
      path: 'news-list/add-new',
      component: () => import('@/view/news/add-new'),
      meta: {
        title: '新闻增改'
      }
    },
  ]
}
export default newsRouter
