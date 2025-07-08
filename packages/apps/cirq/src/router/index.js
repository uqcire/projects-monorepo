import ContactDetail from '@/views/ContactDetail.vue'
import Contacts from '@/views/Contacts.vue'
import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: Contacts
    },
    {
      path: '/contacts/:id',
      name: 'contact-detail',
      component: ContactDetail,
      props: true
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Cirq`
  next()
})

export function setupRouter(app) {
  app.use(router)
}

export default router
