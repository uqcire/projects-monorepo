import { createRouter, createWebHistory } from 'vue-router'
import { Routes as routes } from './routes'

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | ***`
  next()
})

export function setupRouter(app) {
  app.use(router)
}
