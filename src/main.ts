import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import vuetify from './plugins/vuetify'
import './assets/main.css'


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.mount('#app')
