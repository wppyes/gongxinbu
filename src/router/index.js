import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Layout from '@/view/layout/Layout'
import activityRouter from './modules/activity'
import newsRouter from './modules/news'
import noticeRouter from './modules/notice'
import serviceRouter from './modules/service'
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/view/login/index'),
    hidden: true,
    meta: {
      title: '登录'
    }
  }, 
   
  {
    path: '/',
    component:Layout,
    hidden: true,
    children: [
      {
        path: 'console',
        component: () => import('@/view/console'),
        meta: {
          title: '欢迎'
        }
      },
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/view/errorPage/401'),
        name: 'Page401',
        meta: { title: '401',}
      },
      {
        path: '404',
        component: () => import('@/view/errorPage/404'),
        name: 'Page404',
        meta: { title: '404'}
      }
    ]
  },
  activityRouter,
  newsRouter,
  noticeRouter,
  serviceRouter
]
const router = new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  to.meta.keepAlive = false;
  next()
})

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
export default router