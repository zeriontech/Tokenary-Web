<template>
    <div v-if="unacceptedTransactions.length > 0">
        <h4 class="title">{{$t('not_mined_transactions')}}</h4>
        <div class="card mb-4 card-body">
            <transaction-pending
                    v-for="transaction in unacceptedTransactions"
                    v-bind:transaction="transaction"
                    v-if="unacceptedTransactions.length"
                    :key="transaction.id">
            </transaction-pending>
        </div>
    </div>
</template>

<script>
import TransactionPending from './Cells/TransactionPending'
import { mapState } from 'vuex'

export default {
  components: {
    TransactionPending
  },
  name: 'not-mined-transaction-list',
  computed: {
    ...mapState([
      'unacceptedTransactions'
    ])
  }
}
</script>

<style scoped>
</style>

<i18n>
    {
        "en": {
            "not_mined_transactions": "Pending transactions"
        },
        "ru": {
            "not_mined_transactions": "В процессе принятия"
        }
    }
</i18n>
