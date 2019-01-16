// initial state
import { LedgerService } from '../../common/LedgerService'

const initialState = {
  ledgerProviderAddresses: [],
  ledgerRecentAddresses: []
}

const state = Object.assign({}, initialState)

// getters
const getters = {}

// actions
const actions = {
  async getLedgerAccounts ({ state, dispatch }, offset = 0) {
    dispatch('wait/start', 'fetching ledger accounts', { root: true })
    return new Promise((resolve) => {
      LedgerService.getAccounts(offset).then(accounts => {
        if (typeof accounts === 'undefined') {
          dispatch('populateErrors', 'no accounts')
        }

        dispatch('wait/end', 'fetching ledger accounts', { root: true })
        resolve(accounts)
      }).catch(e => {
        resolve([])
        dispatch('populateErrors', e.message)
        dispatch('wait/end', 'fetching ledger accounts', { root: true })
      })
    })
  },
  addLedgerRecentAddresses ({ commit, dispatch, getters }, address) {
    commit('updateAccountLedgerProviderRecentAddresses', address)
  },
  pushAccountLedgerProviderAddress ({ commit }, addresses) {
    commit('updateAccountLedgerProviderAddresses', addresses)
  },
  updateAccountLedgerProviderAddressesEth ({ commit }, data) {
    state.ledgerProviderAddresses.forEach((item) => {
      commit('updateBalanceAccountLedgerProviderAddresses', {
        address: item.address,
        balance: data.balances[item.address.toLowerCase()].balance,
        balanceUsd: data.balances[item.address.toLowerCase()].total_value_usd
      })
    })
  }
}

// mutations
const mutations = {
  updateAccountLedgerProviderAddresses (state, addresses) {
    state.ledgerProviderAddresses = addresses
  },
  updateAccountLedgerProviderRecentAddresses (state, address) {
    if (state.ledgerRecentAddresses.indexOf(address) === -1) {
      state.ledgerRecentAddresses = state.ledgerRecentAddresses.concat(address)
    }
  },
  updateBalanceAccountLedgerProviderAddresses (state, object) {
    state.ledgerProviderAddresses.find((item) => {
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
