import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(VueQueryPlugin)

app.mount('#app')
