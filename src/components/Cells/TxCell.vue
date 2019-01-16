<template>
    <div class="list-group-item borderless pointer tx-cell">
        <div class="row">
            <div class="col-sm-1 mr-5" @click="transactionLink">
                <tx-image
                        v-bind:transaction="transaction"
                        v-bind:showLogo="selectedToken === 'ALL'"
                        v-bind:direction="direction"
                />
            </div>
            <div class="col-sm-10">
                <div class="row">
                    <div class="col-sm-12" @click="transactionLink">
                        <tx-label
                                v-bind:direction="direction"
                                v-bind:transaction="transaction"
                                v-bind:txClass="txClass"
                        />
                    </div>
                    <div class="col-md-7">
                        <tx-direction
                                v-bind:label="direction.label"
                                v-bind:address="direction.address"
                        />
                    </div>
                    <div class="col-md-5 text-right" @click="transactionLink">
                        <tx-timestamp
                                v-bind:timestamp="transaction.formatDate"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import TxImage from '../Transaction/TxImage'
import TxDirection from '../Transaction/TxDirection'
import TxTimestamp from '../Transaction/TxTimestamp'
import TxLabel from '../Transaction/TxLabel'

export default {
  components: {
    TxLabel,
    TxTimestamp,
    TxDirection,
    TxImage
  },
  name: 'tx-cell',
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
    txClass: function () {
      let txData = this.direction
      if (txData.failed) {
        return 'failed'
      } else if (txData.incoming) {
        return 'incoming'
      } else {
        return 'outgoing'
      }
    },
    direction: function () {
      if (this.transaction.from === this.transaction.to && this.transaction.from === this.accountAddress) {
        return {
          type: this.transaction.type,
          label: 'self',
          address: this.transaction.to,
          failed: !this.transaction.hasSucceed,
          incoming: false,
          sign: '-'
        }
      } else if (this.transaction.from === this.accountAddress) {
        return {
          type: this.transaction.type,
          label: 'to',
          address: this.transaction.to,
          failed: !this.transaction.hasSucceed,
          incoming: false,
          sign: '-'
        }
      } else if (this.transaction.to === this.accountAddress) {
        return {
          type: this.transaction.type,
          label: 'from',
          address: this.transaction.from,
          failed: !this.transaction.hasSucceed,
          incoming: true,
          sign: '+'
        }
      } else if (this.transaction.contract !== null) {
        return {
          type: this.transaction.type,
          label: 'address',
          address: this.transaction.contract,
          failed: !this.transaction.hasSucceed,
          incoming: false,
          sign: '-'
        }
      } else {
        return {
          type: this.transaction.type,
          label: 'address',
          address: this.transaction.to,
          failed: !this.transaction.hasSucceed,
          incoming: false,
          sign: '-'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

    .tx-label {
        font-size: 1.8rem;
    }

    .incoming {
        color: $incoming;
    }

    .failed {
        color: $failed;
    }

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

    .borderless {
        border: 0 none;
    }

    .tx-cell {
        &:hover {
            transition: background-color .1s ease;
            background-color: $backgroundLightGrey;
        }

        &:active {
            transition: background-color .1s ease;
            background-color: darken($backgroundLightGrey, 5%);
        }
    }

</style>
