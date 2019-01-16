<template>
    <div v-if="transaction.type === 'contract_execution'" class="tx-label" v-bind:class="txClass">
        Contract Execution
    </div>
    <div v-else-if="transaction.type === 'contract_deployment'" class="tx-label" v-bind:class="txClass">
        Contract Deployment
    </div>
    <div v-else class="tx-label" v-bind:class="txClass">
        {{direction.sign}}{{transaction.value}} {{transaction.symbol}}
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'tx-label',
  props: ['direction', 'transaction', 'txClass'],
  computed: {
    ...mapState({
      accountCurrency: state => state.account.currency
    })
  }
}
</script>

<style scoped>

</style>
