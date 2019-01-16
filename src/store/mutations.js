const initialState = {
  blockChainStats: [],
  tokens: [],
  customTokens: [],
  transactions: [],
  unacceptedTransactions: [],
  ethereum: null,
  total: null,
  hasMorePages: false,
  nextPage: 1,
  currentPage: 1,
  selectedToken: 'ALL',
  rates: [],
  currentTransactionHash: null,
  selectedTransaction: [],

  errors: []
}

function checkAddress (state) {
  return state.account.address != null && state.account.address !== '' && state.account.address !== ' '
}

export const state = Object.assign({}, initialState)

export const mutations = {
  FETCH_TOKENS (state, tokens) {
    if (checkAddress(state)) {
      state.tokens = tokens
    }
  },
  FETCH_ETHEREUM (state, ethereum) {
    if (checkAddress(state)) {
      state.ethereum = ethereum
    }
  },
  FETCH_CUSTOM_TOKENS (state, customTokens) {
    if (checkAddress(state)) {
      state.customTokens = customTokens
    }
  },
  FETCH_TOTAL_BALANCE (state, total) {
    if (checkAddress(state)) {
      state.total = total
    }
  },
  FETCH_SELECTED_TRANSACTION (state, transaction) {
    state.selectedTransaction = transaction
  },
  FETCH_TRANSACTIONS (state, transactions) {
    if (checkAddress(state)) {
      state.transactions = transactions
    }
  },
  ADD_TRANSACTION (state, transaction) {
    state.transactions = [transaction, ...state.transactions]
  },
  ADD_UNACCEPTED_TRANSACTION (state, unacceptedTransaction) {
    state.unacceptedTransactions = [unacceptedTransaction, ...state.unacceptedTransactions]
  },
  UPDATE_UNACCEPTED_TRANSACTION (state, unacceptedTransaction) {
    state.unacceptedTransactions.find((item) => {
      if (item.hash === unacceptedTransaction.hash) {
        item.status = unacceptedTransaction.status
      }
    })
  },
  REMOVE_UNACCEPTED_TRANSACTION_BY_HASH (state, hash) {
    state.unacceptedTransactions = state.unacceptedTransactions.filter(function (transaction) {
      return transaction.hash !== hash
    })
  },
  LOAD_MORE (state, transactions) {
    if (checkAddress(state)) {
      state.transactions.push(...transactions)
    }
  },
  UPDATE_PAGINATION (state, pagination) {
    state.hasMorePages = pagination.hasMorePages
    state.currentPage = pagination.currentPage
    if (state.hasMorePages === true) {
      state.nextPage = state.currentPage + 1
    }
  },
  SELECT_TOKEN (state, token) {
    state.selectedToken = token
  },
  FETCH_RATES (state, rates) {
    state.rates = rates
  },
  UPDATE_BLOCKHAIN_STATS (state, stats) {
    state.blockChainStats = stats
  },
  UPDATE_CURRENT_TRANSACTION_HASH (state, hash) {
    state.currentTransactionHash = hash
  },
  resetState (state) {
    initialState.rates = state.rates
    initialState.transactions = []
    Object.assign(state, initialState)
  },
  addError: (state, error) => state.errors.unshift(error),
  popError: state => state.errors.pop()
}
