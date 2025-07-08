import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: 'Home' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/pages/404.vue'),
    meta: { title: '404 - Page not found' },
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/homepage/index.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/offices',
    name: 'Offices',
    component: () => import('@/pages/offices/index.vue'),
    meta: { title: 'Melbourne Office' },
  },
  {
    path: '/contact-us',
    name: 'Contact',
    component: () => import('@/pages/contacts/index.vue'),
    meta: { title: 'Contact Us' },
  },
  {
    path: '/contact-us/contact-form',
    name: 'ContactForm',
    component: () => import('@/pages/contacts/contact-form.vue'),
    meta: { title: 'Contact Us' },
  },
  {
    path: '/contact-us/contact-form-thank-you',
    name: 'ContactThankYou',
    component: () => import('@/pages/contacts/contact-form-thank-you.vue'),
    meta: { title: 'Thank You' },
  },
  {
    path: '/contact-us/subscribe-thank-you',
    name: 'SubscribeThankYou',
    component: () => import('@/pages/subscription/thank-you.vue'),
    meta: { title: 'Thank You for subscribing' },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (typeof to.meta.title === 'string') {
    document.title = `${to.meta.title} | GCN`;
  }
  next();
});

export default router;
