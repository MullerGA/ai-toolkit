import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/index.css'

const pinia = createPinia()
const app = createApp(App)

// Configuration de Pinia avant son utilisation
app.use(pinia)
app.use(router)

app.mount('#app')
