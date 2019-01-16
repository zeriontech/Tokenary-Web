<template>
    <div class="transactions">
        <h4 class="title">{{$t('transactions')}}</h4>

        <v-wait for='fetching transactions'>
            <template slot='waiting'>
                <spinner/>
            </template>

            <div class="empty" v-if="!Object.keys(filteredTransfers).length">
                <h3 class="date">Transactions list is empty</h3>
            </div>

            <div class="card mb-4 card-body" v-for="(item, date) in filteredTransfers" v-bind:key="date">
                <span class="card-title date">{{date}}</span>

                <div v-for="(transaction, index) in item" v-bind:key="index">
                    <tx-cell v-bind:transaction="transaction" :key="transaction.id" />
                    <div v-if="index !== item.length - 1">
                        <hr class="gap">
                    </div>
                </div>
            </div>

            <v-wait for='load more transaction' class="text-center">
                <template slot='waiting'>
                    <spinner/>
                </template>
                <button v-if="hasMorePages === true"
                        type="button"
                        class="btn btn-outline-primary btn-lg"
                        v-on:click="loadMoreTransactions">
                    {{$t('load_more')}}
                </button>
            </v-wait>
        </v-wait>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Spinner from './Shared/Spinner'
import TransactionCell from './Cells/TransactionCell'
import ContractDeployment from './Cells/ContractDeployment'
import ContractExecution from './Cells/ContractExecution'
import TxCell from './Cells/TxCell'

export default {
  components: {
    TxCell,
    Spinner,
    TransactionCell,
    ContractExecution,
    ContractDeployment
  },
  name: 'transactions-list',
  computed: {
    ...mapGetters([
      'filteredTransfers'
    ]),
    ...mapState([
      'hasMorePages'
    ]),
    ...mapState({
      accountAddress: state => state.account.address
    })
  },
  methods: {
    ...mapActions([
      'loadMore'
    ]),
    loadMoreTransactions () {
      this.loadMore({ account: this.accountAddress })
    }
  }
}
</script>

<style scoped>
    .date {
        font-size: 1.7rem;
        color: black;
        opacity: 0.6;
    }
</style>

<i18n>
    {
        "en": {
            "transactions": "Transactions",
            "load_more": "Load More"
        },
        "ru": {
            "transactions": "Транзакции",
            "load_more": "Больше"
        }
    }
</i18n>
