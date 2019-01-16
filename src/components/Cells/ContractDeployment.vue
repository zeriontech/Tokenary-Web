<template>
    <div class="row col-md-12">
        <div class="">
            <router-link v-if="transaction.blockNumber !== 0" :to="{name: 'transaction', params: {hash: transaction.hash}}">
                {{transaction.hash}}
            </router-link>
        </div>
        <div class="row">
            <div class="col-md-2">
                <transaction-image v-bind:url="transaction.image ? transaction.image.url : false" v-bind:hash="transaction.contractAddress"/>
                <div class="">
                    <span v-if="direction.incoming" class="text-white text-center income small mod">Income</span>
                    <span v-else class="text-white text-center outcome small mod">Outcome</span>
                    <span v-if="!transaction.hasSucceed" class="text-white text-center failed small mod">Failed</span>
                </div>
            </div>
            <div class="col-md-10 row">
                <div class="col-md-12">
                    ContractDeployment
                </div>
                <transaction-direction
                        v-bind:direction="this.direction.label"
                        v-bind:address="this.direction.address">
                </transaction-direction>

                <transaction-value
                        v-bind:value="transaction.value"
                        v-bind:sign="direction.sign"
                        v-bind:token-symbol="transaction.symbol"
                        v-bind:currency="transaction.total">
                </transaction-value>

                <transaction-fee
                        v-bind:ethFee="transaction.ethFee"
                        v-bind:fee="transaction.fee">
                </transaction-fee>

                <transaction-timestamp
                        v-bind:timestamp="transaction.formatDate">
                </transaction-timestamp>
            </div>
            <div class="col-md-12">
                <hr>
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
  name: 'contract-deployment',
  props: ['transaction'],
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
      accountAddress: state => state.account.address
    })
  }
}
</script>

<style lang="scss" scoped>
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
