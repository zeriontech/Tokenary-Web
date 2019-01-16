import WalletConnect from 'walletconnect'

export const WalletConnectService = {
  store: null,
  webConnector: false,
  accounts: [],
  listenSession: false,
  initSession: false,

  createWebConnector () {
    this.webConnector = new WalletConnect({
      bridgeUrl: process.env.VUE_APP_WALLETCOONNECT_BRIDGE_URL, // Required
      dappName: process.env.VUE_APP_WALLETCOONNECT_DAPP_NAME // Required
    })
  },

  async newSession () {
    if (!this.initSession) {
      await this.webConnector.initSession()
      this.initSession = true

      return this.webConnector.uri
    } else {
      return this.webConnector.uri
    }
  },

  async listenSessionStatus () {
    if (!this.listenSession) {
      this.listenSession = true
      await this.webConnector.listenSessionStatus()

      this.accounts = []

      return new Promise((resolve) => {
        this.webConnector.accounts.forEach((item) => {
          this.accounts.push({ address: item, balance: 0, balanceUsd: null })
        })
        this.listenSession = false
        resolve(this.accounts)
      })
    }
  },

  stopLastListener () {
    this.webConnector.stopLastListener()
    this.listenSession = false
  },

  async walletConnectSendTransaction (transaction) {
    return new Promise((resolve, reject) => {
      if (this.webConnector.isConnected) {
        this.webConnector.sendTransaction(transaction).then(hash => {
          resolve(hash)
        }).catch(error => {
          reject(error)
        })
      }
    })
  },

  killSession () {
    this.initSession = false

    return !!this.webConnector.isConnected
  }
}
