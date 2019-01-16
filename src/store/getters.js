import { BigNumber } from 'bignumber.js'
import mixins from '../mixins.js'
import moment from 'moment'
import utils from 'web3-utils'

export const st = {
  formattedTransfers: (state, transfers) => {
    const address = state.account.address.toLowerCase()
    return transfers.filter(function (transfer) {
      return address === '' || transfer.from === address || transfer.to === address
    }).map((transfer) => {
      return {
        failed: false,
        image: (transfer.contract.image !== null) ? transfer.contract.image.url : null,
        contractAddress: transfer.contractAddress,
        symbol: transfer.contract.symbol,
        value: transfer.value,
        from: transfer.from ? utils.toChecksumAddress(transfer.from) : '',
        to: transfer.to ? utils.toChecksumAddress(transfer.to) : '',
        total: mixins.methods.formattedTotal(transfer.total, state.account.currency.decimals_min, state.account.currency.decimals_max)
      }
    })
  },
  transfer: (state, transaction, transfer, type) => {
    return Object.assign(st.transaction(state, transaction, type), {
      image: transfer.contract.image,
      contractAddress: transfer.contractAddress,
      symbol: transfer.contract.symbol,
      value: transfer.value,
      from: transfer.from ? utils.toChecksumAddress(transfer.from) : '',
      to: transfer.to ? utils.toChecksumAddress(transfer.to) : '',
      total: mixins.methods.formattedTotal(transfer.total, state.account.currency.decimals_min, state.account.currency.decimals_max)
    })
  },
  transaction: (state, transaction, type) => {
    const ethereumImageUrl = 'https://s3.eu-central-1.amazonaws.com/files.blockstore.org/tokens/128/ETH.png'
    return {
      type: type,
      hash: transaction.hash,
      contract: transaction.contract,
      hasSucceed: transaction.hasSucceed,
      image: { url: ethereumImageUrl },
      value: transaction.value,
      symbol: 'ETH',
      to: transaction.to ? utils.toChecksumAddress(transaction.to) : '',
      from: transaction.from ? utils.toChecksumAddress(transaction.from) : '',
      fee: mixins.methods.formattedTotal(transaction.fee, state.account.currency.decimals_min, state.account.currency.decimals_max),
      ethFee: transaction.ethFee,
      gas: transaction.gas,
      gasPrice: new BigNumber(transaction.gasPrice).dividedBy(10e8).toString(),
      gasUsed: transaction.gasUsed,
      timestamp: transaction.timestamp,
      formatDate: transaction.formatDate,
      hasInput: transaction.hasInput,
      total: mixins.methods.formattedTotal(transaction.total, state.account.currency.decimals_min, state.account.currency.decimals_max),
      transfers: st.formattedTransfers(state, transaction.transfers),
      blockNumber: transaction.blockNumber,
      original: {
        to: transaction.to ? utils.toChecksumAddress(transaction.to) : '',
        from: transaction.from ? utils.toChecksumAddress(transaction.from) : '',
        symbol: 'ETH',
        value: transaction.value,
        image: { url: ethereumImageUrl },
        total: mixins.methods.formattedTotal(transaction.total, state.account.currency.decimals_min, state.account.currency.decimals_max),
        failed: !transaction.hasSucceed
      }
    }
  },
  filtered: (state, transaction) => {
    if (transaction.blockNumber) {
      if (transaction.contract !== null && transaction.to === null) {
        return st.transaction(state, transaction, 'contract_deployment')
      }

      if (transaction.hasInput === true && transaction.transfers.length === 0 && transaction.value === '0') {
        return st.transaction(state, transaction, 'contract_execution')
      }

      if (transaction.transfers && transaction.transfers.length) {
        if (transaction.transfers.length === 1) {
          return st.transfer(state, transaction, transaction.transfers[0], 'single_token_transfer')
        } else {
          return st.transfer(state, transaction, transaction.transfers[0], 'multi_transfer')
        }
      }

      return st.transaction(state, transaction, 'transaction')
    }
  }
}

function dataHelper (timestamp) {
  const date = moment.unix(timestamp)

  let result = {}
  result.key = date.calendar(null, {
    sameDay: function () {
      result.value = this.format('hh:mm')
      return '[Today]'
    },
    lastDay: function () {
      result.value = this.format('hh:mm')
      return '[Yesterday]'
    },
    lastWeek: function () {
      result.value = this.format('ddd, hh:mm')
      return '[This Week]'
    },
    sameElse: function (now) {
      if (this.isBefore(now, 'month')) {
        result.value = this.format('MMMM DD YYYY, hh:mm')
        return 'MMMM YYYY'
      }
      if (this.isBefore(now, 'week')) {
        result.value = this.format('D MMM, hh:mm')
        return '[This Month]'
      }
    }
  })

  return result
}

export const getters = {
  filteredTransfers: state => {
    moment.locale(state.account.language)
    const transactions = {}
    for (let transaction of state.transactions) {
      const date = dataHelper(transaction.timestamp)
      transaction.formatDate = date.value
      if (!transactions[date.key]) {
        transactions[date.key] = []
      }

      transactions[date.key].push(st.filtered(state, transaction))
    }
    return transactions
  },
  filteredTransfer: state => {
    return st.filtered(state, state.selectedTransaction)
  },
  tokens: state => state.tokens,
  orderedTokens: state => {
    return state.tokens.slice().sort((a, b) => {
      if (a.total_value_usd < b.total_value_usd) {
        return 1
      }
      if (a.total_value_usd > b.total_value_usd) {
        return -1
      }
      if (a.total_value_usd === b.total_value_usd) {
        if (a.title < b.title) {
          return -1
        }
        if (a.title > b.title) {
          return 1
        }
      }
      return 0
    })
  },
  countLowMarketTokens: state => {
    let count = 0
    state.tokens.forEach((item) => {
      if (item.price.USD.total < 5) {
        count++
      }
    })
    return count
  }
}
