import Vuex from 'vuex'
import Vue from 'vue'
import { mutations, state } from './mutations'
import { actions } from './actions'
import { getters } from './getters'
import account from './modules/account'
import walletConnect from './modules/walletConnect.module'
import metaMask from './modules/metaMask.module'
import ledger from './modules/ledger.module'
import zrx from './modules/zrx.module'
import { checkTransactionPending } from './plugins/plugins'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    account,
    walletConnect,
    metaMask,
    ledger,
    zrx
  },
  plugins: [checkTransactionPending],
  strict: 'debug'
})
