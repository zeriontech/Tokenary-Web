// initial state

const initialState = {
}

const state = Object.assign({}, initialState)

// getters
const getters = {
  hasBuy: (state, getters, rootState, rootGetters) => {
    if (rootState.account.type === 'WALLETCONNECT') {
      return true
    }
    if (rootState.account.type === 'LEDGER') {
      return true
    }
    if (rootState.account.type === 'METAMASK') {
      if (rootState.account.address !== '' &&
        rootState.metaMask.inject &&
        rootState.metaMask.userAccess &&
        rootGetters.isMainNetwork &&
        rootState.metaMask.address &&
        rootState.account.address === rootState.metaMask.address.address) {
        return true
      }
    }
    return false
  }
}

// actions
const actions = {
}

// mutations
const mutations = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
