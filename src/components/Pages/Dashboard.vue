<template>
    <div class="container">
      <div class="mt-1 row justify-content-center">
        <div class="col-md-5">
          <account-info/>
          <wallets-list/>
        </div>
        <div class="col-md-7">
          <not-mined-transaction-list/>
          <transactions-list/>
        </div>
      </div>
    </div>
</template>

<script>
import WalletsList from '../WalletsList'
import TransactionsList from '../TransactionsList'
import NotMinedTransactionList from '../NotMinedTransactionList'
import AccountInfo from '../AccountInfo'
import { mapActions } from 'vuex'

export default {
  name: 'dashboard',
  components: {
    AccountInfo,
    WalletsList,
    NotMinedTransactionList,
    TransactionsList
  },
  methods: {
    ...mapActions([
      'metamaskCheck',
      'fetchRates'
    ])
  },
  created: function () {
    this.metamaskCheck()
    this.fetchRates()
  }
}
</script>

<style lang="scss" scoped>
</style>
