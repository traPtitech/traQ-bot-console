import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { store } from './store'
import { registerSW } from 'virtual:pwa-register'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
import './styles/quasar.styl'
import lang from 'quasar/lang/ja.js'
import { Quasar, Notify, Loading, Dialog } from 'quasar'

// https://vite-pwa-org.netlify.app/guide/prompt-for-update.html
const updateSW = registerSW({
  onNeedRefresh: () => {
    Notify.create({
      message: '新しいBOT Consoleが利用できます。',
      color: 'teal',
      icon: 'update',
      textColor: 'white',
      timeout: 3600 * 1000,
      actions: [
        {
          label: 'ページを更新',
          color: 'yellow',
          handler: () => {
            void updateSW()
          }
        },
        {
          label: '後で',
          color: 'white',
          handler: () => {}
        }
      ]
    })
  }
})

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
