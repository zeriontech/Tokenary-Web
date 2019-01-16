// initial state
import { MetaMaskService } from '../../common/MetaMaskService'

const initialState = {
  userAccess: false,
  inject: false,
  networkId: 0,
  address: ''
}

const state = Object.assign({}, initialState)

// getters
const getters = {}

// actions
const actions = {
  metamaskCheck () {
    MetaMaskService.checkInject(this)
  },
  getMetaMaskAccounts ({ state, dispatch }, isOnce = false) {
    MetaMaskService.checkMetaMask(isOnce, this)
  },
  updateMetamaskUserAccess ({ commit }, status) {
    commit('updateMetamaskUserAccess', status)
  },
  updateMetamaskInject ({ commit }, status) {
    commit('updateMetamaskInject', status)
  },
  updateMetamaskAddress ({ commit }, address) {
    commit('updateMetamaskAddress', address)
  },
  updateMetamaskAddressBalance ({ commit }, { address, data }) {
    commit('updateMetamaskAddressBalance', {
      address: address,
      balance: data.balances[address.toLowerCase()].balance,
      balanceUsd: data.balances[address.toLowerCase()].total_value_usd
    })
  },
  updateMetamaskNetworkId ({ commit }, networkId) {
    commit('updateMetamaskNetworkId', networkId)
  }
}

// mutations
const mutations = {
  updateMetamaskUserAccess (state, status) {
    state.userAccess = status
  },
  updateMetamaskInject (state, status) {
    state.inject = status
  },
  updateMetamaskAddress (state, address) {
    state.address = address
  },
  updateMetamaskAddressBalance (state, object) {
    state.address = object
  },
  updateMetamaskNetworkId (state, networkId) {
    state.networkId = networkId
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
