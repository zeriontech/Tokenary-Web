<template>
    <div class="row pointer tx-cell">
        <div class="col-sm-1 mr-5" @click="transactionLink">

            <transaction-image v-if="selectedToken === 'ALL'" v-bind:url="transaction.image ? transaction.image.url : false"
                               v-bind:hash="transaction.contractAddress"/>
            <transaction-image v-else v-bind:url="false"
                               v-bind:hash="this.direction.address"/>
        </div>
        <div class="col-sm-10">
            <div class="row">
                <div class="col-md-12" @click="transactionLink">
                    <transaction-value
                            v-bind:value="transaction.value"
                            v-bind:sign="direction.sign"
                            v-bind:token-symbol="transaction.symbol"
                            v-bind:currency="transaction.total"
                            v-bind:hasSucceed="transaction.hasSucceed"
                    >
                    </transaction-value>
                </div>
                <div class="col-md-7">
                    <transaction-direction
                            v-bind:direction="this.direction.label"
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
  name: 'transaction-cell',
  props: ['transaction'],
  methods: {
    transactionLink () {
      this.$router.push({ name: 'transaction', params: { hash: this.transaction.hash } })
    }
  },
  computed: {
    ...mapState({
      accountAddress: state => state.account.address,
      selectedToken: state => state.selectedToken
    }),
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
      } else if (this.transaction.contract !== null) {
        return {
          label: 'contract',
          address: this.transaction.contract,
          incoming: false,
          sign: '-'
        }
      } else {
        return {
          label: '',
          address: '',
          incoming: false,
          sign: '-'
        }
      }
    }
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
        color: black;

    }

    .income {
        color: #56B268;
    }

    .failed {
        background-color: #FB2D55;
    }

    .tx-cell {
        &:hover {
            background-color: lighten($tokenary, 40%);
        }
        &:active {
            background-color: lighten($tokenary, 35%);
        }
    }

</style>
