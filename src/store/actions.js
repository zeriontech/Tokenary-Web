import {
  getBlockChainStats,
  getRates,
  getTokens,
  getTransactionByHash,
  getTransactions,
  getTransactionsByToken,
  getCollectibles
} from '../api'
import router from '../config/router'
import Vue from 'vue'

export const actions = {
  fetchTokens ({ commit, state, dispatch, getters }) {
    dispatch('wait/start', 'fetching tokens', { root: true })

    let account = state.account.address

    return new Promise((resolve) => {
      getTokens(account, getters.getAccountCurrencyName).then((res) => {
        if (res) {
          commit('FETCH_ETHEREUM', res.data.ethereum)
          commit('FETCH_TOKENS', res.data.tokens)
          commit('FETCH_CUSTOM_TOKENS', res.data.custom_tokens)
          commit('FETCH_TOTAL_BALANCE', res.data.total_usd)
        }
        dispatch('wait/end', 'fetching tokens', { root: true })
        resolve()
      })
        .catch(() => {
          dispatch('wait/end', 'fetching tokens', { root: true })
        })
    })
  },
  refreshTransactions ({ commit, state, dispatch, getters }) {
    dispatch('wait/start', 'fetching transactions', { root: true })

    let account = state.account.address

    return new Promise((resolve) => {
      if (state.selectedToken === 'ALL') {
        getTransactions(account, getters.getAccountCurrencyName, 1, state.currentPage * 5).then((res) => {
          commit('FETCH_TRANSACTIONS', res.data.transactions)
          commit('UPDATE_PAGINATION', {
            hasMorePages: res.data.pagination.hasMorePages,
            currentPage: res.data.pagination.perPage / 5
          })
          dispatch('wait/end', 'fetching transactions', { root: true })
          resolve()
        })
      } else {
        getTransactionsByToken(account, state.selectedToken, getters.getAccountCurrencyName, 1, state.currentPage * 5).then(res => {
          commit('FETCH_TRANSACTIONS', res.data.transactions)
          commit('UPDATE_PAGINATION', {
            hasMorePages: res.data.pagination.hasMorePages,
            currentPage: res.data.pagination.perPage / 5
          })
          dispatch('wait/end', 'fetching transactions', { root: true })
          resolve()
        })
      }
    })
  },
  addTransaction ({ commit, state }, { transaction }) {
    commit('ADD_TRANSACTION', transaction)
  },
  removeUnacceptedTransactionByHash ({ commit, state }, { hash }) {
    commit('REMOVE_UNACCEPTED_TRANSACTION_BY_HASH', hash)
  },
  loadMore ({ commit, state, getters, dispatch }) {
    let account = state.account.address
    dispatch('wait/start', 'load more transaction', { root: true })

    return new Promise((resolve) => {
      if (state.selectedToken === 'ALL') {
        getTransactions(account, getters.getAccountCurrencyName, state.nextPage).then((res) => {
          commit('LOAD_MORE', res.data.transactions)
          commit('UPDATE_PAGINATION', res.data.pagination)
          dispatch('wait/end', 'load more transaction', { root: true })
          resolve()
        })
      } else {
        getTransactionsByToken(account, state.selectedToken, getters.getAccountCurrencyName, state.nextPage).then(res => {
          commit('LOAD_MORE', res.data.transactions)
          commit('UPDATE_PAGINATION', res.data.pagination)
          dispatch('wait/end', 'load more transaction', { root: true })
          resolve()
        })
      }
    })
  },
  setSelectedToken ({ commit, state }, address) {
    return new Promise((resolve) => {
      commit('SELECT_TOKEN', address)
      resolve()
    })
  },
  selectToken ({ commit, state, getters, dispatch }, { address }) {
    let account = state.account.address

    dispatch('wait/start', 'fetching transactions', { root: true })

    router.push({
      name: 'token',
      params: { address: account, token: address !== '0x0000000000000000000000000000000000000000' ? address : 'ethereum' }
    })

    return new Promise((resolve) => {
      getTransactionsByToken(account, address, getters.getAccountCurrencyName).then((res) => {
        commit('FETCH_TRANSACTIONS', res.data.transactions)
        commit('SELECT_TOKEN', address)
        commit('UPDATE_PAGINATION', res.data.pagination)
        dispatch('wait/end', 'fetching transactions', { root: true })
        resolve()
      })
    })
  },
  getTransactionByHash ({ commit, state, getters }, { hash }) {
    return new Promise((resolve) => {
      getTransactionByHash(hash, getters.getAccountCurrencyName).then((res) => {
        commit('FETCH_SELECTED_TRANSACTION', res.data.transaction)
        resolve(res.data.transaction)
      })
    })
  },
  seeAll ({ commit, state, getters, dispatch }) {
    let account = state.account.address
    dispatch('wait/start', 'fetching transactions', { root: true })

    router.replace({ name: 'dashboard', params: { account: account } })

    return new Promise((resolve) => {
      getTransactions(account, getters.getAccountCurrencyName).then((res) => {
        if (res.data) {
          commit('FETCH_TRANSACTIONS', res.data.transactions)
          commit('UPDATE_PAGINATION', res.data.pagination)
          commit('SELECT_TOKEN', 'ALL')
        }
        dispatch('wait/end', 'fetching transactions', { root: true })
        resolve()
      })
    })
  },
  getCollectibles ({ commit, state, getters, dispatch }) {
    dispatch('wait/start', 'load blockhain stats', { root: true })

    return new Promise((resolve) => {
      getCollectibles().then((res) => {
        console.log(res)
        // commit('UPDATE_BLOCKHAIN_STATS', res.data.suggested)
        dispatch('wait/end', 'load blockhain stats', { root: true })
        resolve()
      })
    })
  },
  fetchRates ({ commit }) {
    getRates().then((res) => {
      commit('FETCH_RATES', { 'all': res.data.all, 'favorite': res.data.favorite })
    })
  },
  updateBlockChainStats ({ commit, dispatch }) {
    dispatch('wait/start', 'load blockhain stats', { root: true })

    return new Promise((resolve) => {
      getBlockChainStats().then((res) => {
        commit('UPDATE_BLOCKHAIN_STATS', res.data.suggested)
        dispatch('wait/end', 'load blockhain stats', { root: true })
        resolve()
      })
    })
  },
  updateCurrentTransactionHash ({ commit }, { hash }) {
    commit('UPDATE_CURRENT_TRANSACTION_HASH', hash)
  },
  resetState ({ commit }) {
    commit('resetState')
  },
  populateErrors: ({ commit }, error) => {
    commit('addError', error)
    Vue.notify({
      group: 'all',
      title: error,
      duration: 1000000
    })
    setTimeout(() => commit('popError'), 1000000)
  }
}
