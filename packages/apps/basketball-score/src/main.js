import { setupRouter } from '@/router'
import { setupStore } from '@/stores'
import '@/styles/global.css'
import { createApp } from 'vue'
import App from '/App.vue'

const app = createApp(App)

setupRouter(app)
setupStore(app)

app.mount('#app')
