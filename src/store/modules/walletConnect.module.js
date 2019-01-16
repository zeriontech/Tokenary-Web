// initial state
import { WalletConnectService } from '../../common/WalletConnectService'
import { getBalanceEth } from '../../api'

const initialState = {
  uri: null,
  addresses: []
}

const state = Object.assign({}, initialState)

// getters
const getters = {
  hasWalletConnectLocal () {
    if (localStorage.getItem('wcsmngt')) {
      return true
    }
  }
}

// actions
const actions = {
  createWebConnector () {
    WalletConnectService.createWebConnector()
  },
  stopLastListener () {
    WalletConnectService.stopLastListener()
  },
  async initSession ({ state, dispatch }) {
    if (WalletConnectService.initSession) {
      WalletConnectService.listenSessionStatus().then(accounts => {
        dispatch('updateAddresses', accounts, { root: true })
        dispatch('wait/start', 'fetch balance', { root: true })
        getBalanceEth(accounts.map((item) => {
          return item.address
        }), 'USD').then(res => {
          if (res) {
            dispatch('updateBalanceAccountWalletConnectProviderAddresses', res.data)
          }
          dispatch('wait/end', 'fetch balance', { root: true })
        }).catch(e => {
          dispatch('wait/end', 'fetch balance', { root: true })
        })
      })
      return false
    }
    WalletConnectService.newSession().then(uri => {
      dispatch('updateUri', uri, { root: true })

      WalletConnectService.listenSessionStatus().then(accounts => {
        dispatch('updateAddresses', accounts, { root: true })
        dispatch('wait/start', 'fetch balance', { root: true })
        getBalanceEth(accounts.map((item) => {
          return item.address
        }), 'USD').then(res => {
          if (res) {
            dispatch('updateBalanceAccountWalletConnectProviderAddresses', res.data)
          }
          dispatch('wait/end', 'fetch balance', { root: true })
        }).catch(e => {
          dispatch('wait/end', 'fetch balance', { root: true })
        })
      })
    }).catch(error => {
      console.log(error)
    })
  },
  updateUri ({ commit, dispatch, getters }, uri) {
    commit('updateUri', uri)
  },
  updateAddresses ({ commit, dispatch, getters }, addresses) {
    commit('updateAddresses', addresses)
  },
  updateBalanceAccountWalletConnectProviderAddresses ({ commit }, data) {
    state.addresses.forEach((item) => {
      commit('updateBalanceAccountWalletConnectProviderAddresses', {
        address: item.address,
        balance: data.balances[item.address.toLowerCase()].balance,
        balanceUsd: data.balances[item.address.toLowerCase()].total_value_usd
      })
    })
  },
  resetStateWalletConnect ({ commit }) {
    WalletConnectService.killSession()
    localStorage.removeItem('wcsmngt')

    commit('resetStateWalletConnect')
  }
}

// mutations
const mutations = {
  resetStateWalletConnect (state) {
    Object.assign(state, initialState)
  },
  updateUri (state, uri) {
    state.uri = uri
  },
  updateAddresses (state, addresses) {
    state.addresses = addresses
  },
  updateBalanceAccountWalletConnectProviderAddresses (state, object) {
    state.addresses.find((item) => {
      if (item.address === object.address) {
        item.balance = object.balance
        item.balanceUsd = object.balanceUsd
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
