import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import VueClipboard from 'vue-clipboard2'

import './styles/quasar.styl'
import '@quasar/extras/material-icons/material-icons.css'
import {
  Quasar,
  QLayout,
  QHeader,
  QDrawer,
  QPageContainer,
  QPage,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QSeparator,
  QScrollArea,
  QAvatar,
  QSpace,
  QBanner,
  QForm,
  QInput,
  QSelect,
  QImg,
  QCheckbox,
  QUploader,
  QUploaderAddTrigger,
  QSpinner,
  QBreadcrumbs,
  QBreadcrumbsEl,
  QBadge,
  QTabs,
  QTab,
  QTabPanels,
  QTabPanel,
  QTooltip,
  QTable,
  QTh,
  QTr,
  QTd,
  QOptionGroup,
  QField,
  Notify,
  Loading,
  Dialog
} from 'quasar'

Vue.use(VueClipboard)

Vue.use(Quasar, {
  config: {},
  components: {
    QLayout,
    QHeader,
    QDrawer,
    QPageContainer,
    QPage,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QSeparator,
    QScrollArea,
    QAvatar,
    QSpace,
    QBanner,
    QForm,
    QInput,
    QSelect,
    QImg,
    QCheckbox,
    QUploader,
    QUploaderAddTrigger,
    QSpinner,
    QBreadcrumbs,
    QBreadcrumbsEl,
    QBadge,
    QTabs,
    QTab,
    QTabPanels,
    QTabPanel,
    QTooltip,
    QTable,
    QTh,
    QTr,
    QTd,
    QOptionGroup,
    QField
  },
  directives: {},
  plugins: {
    Notify,
    Loading,
    Dialog
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
