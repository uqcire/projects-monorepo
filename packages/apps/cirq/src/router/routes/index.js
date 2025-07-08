export const Routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: 'Home',
    },
  },
    {
    path: '/contacts',
    name: 'contacts',
    component: () => import('@/views/Contacts.vue'),
    meta: {
      title: 'Contacts',
    },
  },
    {
    path: '/contacts:id',
    name: 'contacts-detial',
    component: () => import('@/views/ContactDetail.vue'),
    meta: {
      title: 'Contacts',
    },
  },
]
