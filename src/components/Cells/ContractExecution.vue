<template>
        <div class="row pointer tx-cell">
            <div class="col-md-2" @click="transactionLink">
                <transaction-image v-if="selectedToken === 'ALL'"
                                   v-bind:url="transaction.image ? transaction.image.url : false"
                                   v-bind:hash="transaction.contractAddress"/>
                <transaction-image v-else v-bind:url="false"
                                   v-bind:hash="this.direction.address"/>
            </div>
            <div class="col-md-10 row">
                <div class="col-md-12">
                    Contract Execution
                </div>
                <div v-if="transaction.value > 0" class="col-md-12" @click="transactionLink">
                    <transaction-value
                            v-bind:value="transaction.value"
                            v-bind:sign="direction.sign"
                            v-bind:token-symbol="transaction.symbol"
                            v-bind:currency="transaction.total">
                    </transaction-value>
                </div>
                <div class="col-md-7">
                    <transaction-direction
                            v-bind:direction="'contract'"
                            v-bind:address="this.direction.address">
                    </transaction-direction>
                </div>
                <div class="col-md-5 text-right" @click="transactionLink">
                    <transaction-timestamp
                            v-bind:timestamp="transaction.formatDate">
                    </transaction-timestamp>
                </div>
            </div>
        </div>
</template>

<script>
import TransactionValue from '../Transaction/TransactionValue'
import TransactionTimestamp from '../Transaction/TransactionTimestamp'
import TransactionDirection from '../Transaction/TransactionDirection'
import TransactionImage from '../Transaction/TransactionImage'
import TransactionFee from '../Transaction/TransactionFee'
import { mapState } from 'vuex'

export default {
  components: {
    TransactionValue,
    TransactionTimestamp,
    TransactionDirection,
    TransactionFee,
    TransactionImage
  },
  name: 'contract-execution',
  props: ['transaction'],
  methods: {
    transactionLink () {
      this.$router.push({ name: 'transaction', params: { hash: this.transaction.hash } })
    }
  },
  computed: {
    direction: function () {
      if (this.transaction.from === this.accountAddress) {
        return {
          label: 'to',
          address: this.transaction.to,
          incoming: false,
          sign: '-'
        }
      } else if (this.transaction.to === this.accountAddress) {
        return {
          label: 'from',
          address: this.transaction.from,
          incoming: true,
          sign: '+'
        }
      } else {
        return {
          label: '',
          address: '',
          incoming: false,
          sign: '-'
        }
      }
    },
    ...mapState({
      accountAddress: state => state.account.address,
      selectedToken: state => state.selectedToken
    })
  }
}
</script>

<style lang="scss" scoped>
    .pointer {
        cursor: pointer;
    }

    .mod {
        display: inline-block;
        width: 80px;
        padding: 5px;
        margin-top: 5px;
        margin-bottom: 10px;
        border-radius: 32px;
    }

    .outcome {
        background-color: #ff7b25;

    }

    .income {
        background-color: #82b74b;
    }

    .failed {
        background-color: #f44242;
    }

</style>
