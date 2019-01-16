import TransportU2F from '@ledgerhq/hw-transport-u2f'
import AppEth from '@ledgerhq/hw-app-eth'
import EthereumTx from 'ethereumjs-tx'

export const LedgerService = {
  store: null,
  addresses: [],
  networkId: 1,
  path: '44\'/60\'/0\'/0',
  eth: null,

  async ledgerSignTransaction (transaction) {
    let accounts = this.addresses
    if (!accounts.length) {
      accounts = await this.getAccounts()
    }
    const account = accounts.filter(
      account => account.address.toLowerCase() === transaction.from.toLowerCase()
    )[0]

    const transport = await TransportU2F.create()
    const eth = new AppEth(transport)
    const path = account.path
    try {
      const tx = new EthereumTx(transaction)

      tx.raw[6] = Buffer.from([this.networkId]) // v
      tx.raw[7] = Buffer.from([]) // r
      tx.raw[8] = Buffer.from([]) // s
      const result = await eth.signTransaction(
        path,
        tx.serialize().toString('hex')
      )

      tx.v = Buffer.from(result.v, 'hex')
      tx.r = Buffer.from(result.r, 'hex')
      tx.s = Buffer.from(result.s, 'hex')

      return `0x${tx.serialize().toString('hex')}`
    } catch (error) {
      throw error
    } finally {
      transport.close()
    }
  },

  getDerivationPathComponents (derivationPath = '') {
    const regExp = /^(44'\/6[0|1]'\/\d+'?\/)(\d+)$/
    const matchResult = regExp.exec(derivationPath)

    return { basePath: matchResult[1], index: parseInt(matchResult[2], 10) }
  },

  async getAccounts (offset = 0) {
    const transport = await TransportU2F.create()
    const eth = new AppEth(transport)
    try {
      const addresses = []
      const pathComponents = this.getDerivationPathComponents(this.path)
      for (let i = 0; i < 5; i++) {
        const path = `${pathComponents.basePath}${pathComponents.index + offset + i}`
        const account = await eth.getAddress(path)
        addresses.push({ address: account.address, balance: 0, path: path, balanceUsd: null })
      }
      this.addresses = addresses
      return addresses
    } catch (error) {
      throw error
    } finally {
      transport.close()
    }
  }
}
