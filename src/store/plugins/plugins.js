import { getTransactionByHash } from '../../api'
import { getTransactionReceipt } from '../../common/Web3'

export const checkTransactionPending = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'ADD_UNACCEPTED_TRANSACTION') {
      let timerId = setTimeout(function tick () {
        if (state.account.address === '') {
          clearTimeout(timerId)
        }
        getTransactionReceipt(mutation.payload.hash).then(transaction => {
          if (transaction !== null) {
            store.dispatch('updateUnacceptedTransaction', { hash: mutation.payload.hash, status: 'mined' })

            getTransactionApi(store, mutation, state, mutation.payload.hash)
          } else {
            timerId = setTimeout(tick, 5000)
          }
        })
      }, 5000)
    }
  })
}

function getTransactionApi (store, mutation, state, hash) {
  let timerId = setTimeout(function tick () {
    if (state.account.address === '') {
      clearTimeout(timerId)
    }
    getTransactionByHash(mutation.payload.hash, state.account.currency.name, false).then((res) => {
      if (res) {
        if (state.selectedToken === 'ALL' ||
          (state.selectedToken === '0x0000000000000000000000000000000000000000' && res.data.transaction.transfers.length === 0) ||
          (res.data.transaction.transfers.length > 0 && state.selectedToken === res.data.transaction.transfers[0].contractAddress)) {
          store.dispatch('addTransaction', { transaction: res.data.transaction })
        }
        store.dispatch('removeUnacceptedTransactionByHash', { hash: hash })
        store.dispatch('fetchTokens')
        clearTimeout(timerId)
      } else {
        timerId = setTimeout(tick, 5000)
      }
    }).catch(() => {
      timerId = setTimeout(tick, 5000)
    })
  }, 5000)
}
