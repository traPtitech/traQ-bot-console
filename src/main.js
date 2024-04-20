import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { store } from './store'

import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
import './styles/quasar.styl'
import lang from 'quasar/lang/ja.js'
import { Quasar, Notify, Loading, Dialog } from 'quasar'

const app = createApp(App)

app.use(Quasar, {
  plugins: {
    Notify,
    Loading,
    Dialog
  },
  lang
})

app.config.productionTip = false

app.use(router)
app.use(store)

app.mount('#app')
