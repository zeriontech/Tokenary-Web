import {
  ACCOUNT_RESET,
  ACCOUNT_UPDATE_ADDRESS,
  ACCOUNT_UPDATE_CURRENCY,
  ACCOUNT_UPDATE_LANGUAGE,
  ACCOUNT_UPDATE_TYPE
} from './actions.type'
import { MetaMaskService } from '../../common/MetaMaskService'
import { LedgerService } from '../../common/LedgerService'
import languages from '../../common/json/languages'
import utils from 'web3-utils'
import {
  createSignableTransaction,
  estimateGasContract,
  estimateGasEth,
  getBalance,
  web3SendSignedTransaction
} from '../../common/Web3'
import { WalletConnectService } from '../../common/WalletConnectService'

// initial state
const initialState = {
  address: '',
  type: '',
  language: getBrowserLanguage(),
  currency: getDefaultCurrency()
}

function getDefaultCurrency () {
  return JSON.parse(localStorage.getItem('currency')) ||
    {
      'name': 'USD',
      'full_name': 'US Dollar',
      'symbol': '$',
      'symbol_before': true,
      'decimals_min': 2,
      'decimals_max': 5
    }
}

function getBrowserLanguage () {
  if (localStorage.getItem('language')) {
    return localStorage.getItem('language')
  }

  const lang = navigator.language.slice(0, 2)
  if (languages[lang]) {
    localStorage.setItem('language', lang)
    return lang
  }

  return process.env.VUE_APP_I18N_LOCALE
}

const state = Object.assign({}, initialState)

// getters
const getters = {
  getAccountCurrencyName: state => state.currency.name,
  getAccountCurrencySymbol: state => state.currency.symbol,
  getAccountLanguage: state => state.language,
  couldExecuteTransaction: (state, getters, rootState) => {
    if (state.type === 'LEDGER') {
      return true
    }
    if (state.type === 'WALLETCONNECT') {
      return true
    }
    if (state.type === 'METAMASK') {
      if (state.address !== '' &&
        rootState.metaMask.inject &&
        rootState.metaMask.userAccess &&
        getters.isMainNetwork &&
        rootState.metaMask.address &&
        state.address === rootState.metaMask.address.address) {
        return true
      }
    }
    return false
  },
  isMainNetwork: (state, getters, rootState) => {
    if (state.type === 'METAMASK') {
      return rootState.metaMask.networkId === 1
    }
    return false
  },
  getEstimateGas: state => (from, to, value, gasPrice, contractAddress, gasLimit, data) => {
    return new Promise((resolve, reject) => {
      if (contractAddress !== '0x0000000000000000000000000000000000000000') {
        estimateGasContract(from, to, value, gasPrice, contractAddress, gasLimit).then((fee) => {
          resolve(fee)
        }).catch(reject)
      } else {
        estimateGasEth(from, to, value, gasPrice, gasLimit, data).then((fee) => {
          resolve(fee)
        }).catch(reject)
      }
    })
  },
  getBalance: state => (contractAddress) => {
    return new Promise((resolve) => {
      getBalance(state.address, contractAddress).then((balance) => {
        resolve(balance)
      })
    })
  }
}

// actions
const actions = {
  async sendTransaction ({ state, dispatch }, transactionDummy) {
    const transaction = await createSignableTransaction(transactionDummy)
    return new Promise((resolve, reject) => {
      if (state.type === 'METAMASK') {
        MetaMaskService.sendTransaction(transaction)
          .then(txHash => {
            dispatch('addUnacceptedTransaction', txHash)
            resolve(true)
          })
          .catch(error => {
            reject(error.message)
          })
      }

      if (state.type === 'LEDGER') {
        LedgerService.ledgerSignTransaction(transaction).then(tx => {
          web3SendSignedTransaction(tx)
            .then(txHash => {
              dispatch('addUnacceptedTransaction', txHash)
              resolve(true)
            })
            .catch(error => {
              reject(error)
            })
        }).catch(error => {
          reject(error.message)
        })
      }

      if (state.type === 'WALLETCONNECT') {
        WalletConnectService.walletConnectSendTransaction(transaction).then(txHash => {
          console.log(txHash)
          dispatch('addUnacceptedTransaction', txHash)
          resolve(true)
        }).catch(error => {
          reject(error.message)
        })
      }
    })
  },
  addUnacceptedTransaction ({ commit, dispatch, getters }, hash) {
    let transaction = {
      hash: hash,
      status: 'pending'
    }
    commit('ADD_UNACCEPTED_TRANSACTION', transaction)
    dispatch('updateCurrentTransactionHash', { hash: hash })
  },
  updateUnacceptedTransaction ({ commit, dispatch, getters }, { hash, status }) {
    let transaction = {
      hash: hash,
      status: status
    }
    commit('UPDATE_UNACCEPTED_TRANSACTION', transaction)
  },
  [ACCOUNT_RESET] ({ commit, dispatch }) {
    commit('resetAccount')
    dispatch('resetStateWalletConnect')
  },
  [ACCOUNT_UPDATE_TYPE] ({ commit }, type) {
    commit('updateType', type)
  },
  [ACCOUNT_UPDATE_ADDRESS] ({ commit, dispatch, state }, { address, type, selectedToken }) {
    commit('updateAddress', utils.toChecksumAddress(address))

    if (typeof selectedToken !== 'undefined') {
      dispatch('setSelectedToken', selectedToken)
    }

    if (typeof type !== 'undefined') {
      commit('updateType', type)
    }

    if (state.address !== '') {
      dispatch('fetchTokens')
      dispatch('refreshTransactions')
    }
  },
  [ACCOUNT_UPDATE_CURRENCY] ({ rootState, commit, getters, dispatch }, currency) {
    commit('updateCurrency', currency)

    if (rootState.route.name === 'transaction') {
      dispatch('getTransactionByHash', { hash: rootState.selectedTransaction.hash })
    }

    if (state.address !== '') {
      dispatch('fetchTokens')
      dispatch('refreshTransactions')
    }
  },
  [ACCOUNT_UPDATE_LANGUAGE] ({ commit }, language) {
    commit('updateLanguage', language)
  }
}

// mutations
const mutations = {
  resetAccount (state) {
    initialState.currency = getDefaultCurrency()
    Object.assign(state, initialState)
  },
  updateType (state, type) {
    state.type = type
  },
  updateAddress (state, address) {
    state.address = address
  },
  updateCurrency (state, currency) {
    localStorage.setItem('currency', JSON.stringify(currency))
    state.currency = currency
  },
  updateLanguage (state, language) {
    localStorage.setItem('language', language)
    state.language = language
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
