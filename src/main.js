import Vue from 'vue'
import VueWait from './config/vue-wait'
import { sync } from 'vuex-router-sync'
import VueQrcodeReader from 'vue-qrcode-reader'
import store from './store'
import App from './App'
import router from './config/router'
import VueClipboard from 'vue-clipboard2'
import VeeValidate from 'vee-validate'
import VModal from 'vue-js-modal'
import i18n from './config/i18n'
import moment from 'vue-moment'
import Notifications from 'vue-notification'
import VueOffline from 'vue-offline'
import './styles/app.scss'
import VTooltip from 'v-tooltip'
import VueGtm from 'vue-gtm'

Vue.use(VueClipboard)
Vue.use(VeeValidate)
Vue.use(Notifications)
Vue.use(VueOffline)
Vue.use(VModal)
Vue.use(moment)
Vue.use(VueQrcodeReader)

if (process.env.VUE_APP_GOOGLE_TAG_MANAGER_ENABLE) {
  Vue.use(VueGtm, {
    id: process.env.VUE_APP_GOOGLE_TAG_MANAGER_ID, // Your GTM ID
    vueRouter: router // Pass the router instance to automatically sync with router (optional)
  })
}

Vue.use(VTooltip)

sync(store, router) // done. Returns an unsync callback fn

Vue.config.productionTip = false

// Какой то баг с сетью
process.versions = {
  node: ''
}

new Vue({
  wait: VueWait,
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App },
  render: h => h(App),
  beforeCreate () {
    this.$store.dispatch('updateBlockChainStats')
  }
})
