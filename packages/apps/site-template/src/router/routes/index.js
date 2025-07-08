export const Routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Homepage.vue'),
    meta: {
      title: 'Homepage',
    },
  },
]
