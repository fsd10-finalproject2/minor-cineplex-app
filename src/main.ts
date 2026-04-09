import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './main.css'
import { useAuthStore } from '@/stores/auth'
import { setupGuards } from '@/router/guards'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const auth = useAuthStore()
await auth.me()

setupGuards(router)
app.use(router)

app.mount('#app')
