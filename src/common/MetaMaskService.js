import {
  ACCOUNT_UPDATE_TYPE
} from '../store/modules/actions.type'
import providers from './json/providers'
import utils from 'web3-utils'
import Web3 from 'web3'
import { getBalanceEth } from '../api'

export const MetaMaskService = {
  store: null,
  listenerWork: false,

  checkNetworkId () {
    return new Promise((resolve) => {
      let timer = setTimeout(() => {
        this.store.dispatch('updateMetamaskInject', false)
        this.store.dispatch('updateMetamaskUserAccess', false)
        console.log('Lost connection MetaMask')
      }, 20000)

      window.web3.eth.net.getId().then(netId => {
        if (netId !== this.store.state.metaMask.networkId) {
          this.store.dispatch('updateMetamaskNetworkId', netId)
        }

        clearTimeout(timer)
        resolve(this.store.state.metaMask.networkId)
      })
    })
  },

  checkLogin () {
    return new Promise((resolve) => {
      let timer = setTimeout(() => {
        this.store.dispatch('updateMetamaskInject', false)
        this.store.dispatch('updateMetamaskUserAccess', false)
        console.log('Lost connection MetaMask')
      }, 20000)

      window.web3.eth.getAccounts().then(account => {
        if (account.length !== 0) {
          if (this.store.state.account.type !== 'LEDGER' &&
            (this.store.state.metaMask.address === '' ||
              (this.store.state.metaMask.address &&
                utils.toChecksumAddress(this.store.state.metaMask.address.address) !== utils.toChecksumAddress(account[0])))) {
            this.store.dispatch('updateMetamaskAddress',
              {
                address: utils.toChecksumAddress(account[0]),
                balance: 0,
                balanceUsd: 0
              }
            )

            getBalanceEth([utils.toChecksumAddress(account[0])], 'USD').then(res => {
              if (res) {
                this.store.dispatch('updateMetamaskAddressBalance', {
                  address: utils.toChecksumAddress(account[0]),
                  data: res.data
                })
              }
            })
          }
        } else {
          if (this.store.state.metaMask.userAccess !== false) {
            this.store.dispatch('updateMetamaskAddress', '')
            this.store.dispatch(ACCOUNT_UPDATE_TYPE, providers.watch_address.type)
            this.store.dispatch('updateMetamaskUserAccess', false)
          }
        }

        clearTimeout(timer)
        resolve(account)
      })
    })
  },

  sendTransaction (transaction) {
    return new Promise((resolve, reject) => {
      window.web3.eth.sendTransaction(transaction, (err, txHash) => {
        if (err) {
          reject(err)
        }
        resolve(txHash)
      })
    })
  },

  listener () {
    this.listenerWork = true
    setTimeout(() => {
      if (window.web3IsInjected && this.store.state.account.type !== 'LEDGER') {
        this.checkNetworkId().then(() => {
          this.checkLogin().then(() => {
            setTimeout(this.listener(), 500)
          })
        })
      } else {
        setTimeout(this.listener(), 500)
      }
    }, 500)
  },

  async checkMetaMask (isOnce, store) {
    this.store = store

    // Modern dapp browsers...
    if (window.ethereum) {
      this.store.dispatch('updateMetamaskInject', true)
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        window.web3IsInjected = true
        this.store.dispatch('updateMetamaskUserAccess', true)
        // Acccounts now exposed
      } catch (error) {
        this.store.dispatch('updateMetamaskUserAccess', false)
        window.web3IsInjected = false
        // User denied account access...
      }
    } else if (window.web3) {
      // Legacy dapp browsers...
      this.store.dispatch('updateMetamaskInject', true)
      window.web3 = new Web3(web3.currentProvider)
      window.web3IsInjected = true
      this.store.dispatch('updateMetamaskUserAccess', true)
    } else {
      this.store.dispatch('updateMetamaskInject', false)
      // Non-dapp browsers...
      window.web3 = null
      window.web3IsInjected = false
      this.store.dispatch('updateMetamaskUserAccess', false)
    }

    if (!this.listenerWork) {
      this.listener()
    }
  },

  async checkInject (store) {
    this.store = store

    if (window.ethereum) {
      this.store.dispatch('updateMetamaskInject', true)
    } else if (window.web3) {
      // Legacy dapp browsers...
      this.store.dispatch('updateMetamaskInject', true)
    } else {
      this.store.dispatch('updateMetamaskInject', false)
    }
  }
}
