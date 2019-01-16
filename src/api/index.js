import axios from '../config/axios'
import store from '../store/index'

const walletHeaderName = 'X-Current-Wallet'
const currencyHeaderName = 'X-User-Currency'

function prepareErrorMessage (status) {
  switch (status) {
    case 401:
      return 'Nope, go away'
    case 422:
      return 'Unprosomething entity'
    case 404:
      return "You're lost"
    case 405:
      return 'Read the manual'
    default:
      return 'Error, please try again later'
  }
}

function errorHandler (error) {
  return new Promise((resolve, reject) => {
    let errorStatus = error ? error.response.status : error
    let errorMessage = prepareErrorMessage(errorStatus)
    store.dispatch('populateErrors', errorMessage)

    reject(error)
  })
}

function formatter (res) {
  return new Promise((resolve) => {
    resolve(res.data)
  })
}

function get (path, params = {}, headers = {}, catchError) {
  return axios.instance.get(path, {
    params,
    headers
  })
    .then(formatter)
    .catch(error => {
      if (catchError) {
        errorHandler(error)
      }
    })
}

function post (path, params = {}, headers = {}) {
  return axios.instance.post(path, params, { headers })
    .then(formatter)
    .catch(errorHandler)
}

export function getTransactions (account, currency, page = 1, paginateBy = 5) {
  return get(`/transactions/${account}`, { page, paginateBy }, {
    [walletHeaderName]: 'all',
    [currencyHeaderName]: currency
  })
}

export function getTokens (account, currency) {
  return post('/balance/search', { address: account }, {
    [currencyHeaderName]: currency
  })
}

export function getCollectibles (account, currency) {
  return post('/collectibles', { address: account }, {
    [currencyHeaderName]: currency
  })
}

export function getBalanceEth (account, currency) {
  const addressesArray = JSON.stringify(account)
  return post('/balance/ethereum', { addresses: addressesArray }, {
    [currencyHeaderName]: currency
  })
}

export function getTransactionsByToken (account, address, currency, page = 1, paginateBy = 5) {
  if (address === '0x0000000000000000000000000000000000000000') {
    return get(`/transactions/${account}/ethereum`, { page, paginateBy }, {
      [walletHeaderName]: address,
      [currencyHeaderName]: currency
    })
  } else {
    return get(`/transactions/${account}/transfers/${address}`, { page, paginateBy }, {
      [walletHeaderName]: address,
      [currencyHeaderName]: currency
    })
  }
}

export function getTransactionByHash (hash, currency, catchError) {
  return get(`/transaction/${hash}`, {}, {
    [currencyHeaderName]: currency
  }, catchError)
}

export function getRates () {
  return get('/rates')
}

export function getBlockChainStats () {
  return get('/blockchain/stats')
}
