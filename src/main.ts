import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { store } from './store'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
import './styles/app.css'
import lang from 'quasar/lang/ja.js'
import { Quasar, Notify, Loading, Dialog, Dark } from 'quasar'

const app = createApp(App)

app.use(Quasar, {
  plugins: {
    Notify,
    Loading,
    Dialog,
    Dark
  },
  lang
})

Dark.set('auto')

app.use(store)
app.use(router)

app.mount('#app')
