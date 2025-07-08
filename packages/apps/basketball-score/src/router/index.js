import { createRouter, createWebHistory } from 'vue-router'
import { Routes as routes } from './routes'

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`
  next()
})

export function setupRouter(app) {
  app.use(router)
}
