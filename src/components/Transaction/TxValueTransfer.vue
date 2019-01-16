<template>
    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col-sm value-container">
                    <div class="value" :class="txClass">
                        {{direction.sign}} {{valueTransfer.value}} {{valueTransfer.symbol}}
                    </div>
                </div>
            </div>
            <div v-if="valueTransfer.total > 0" class="row">
                <div class="col-sm">
                    <span class="total">≈ {{formattedTotal}}</span>
                </div>
            </div>
            <div class="tx-content">
                <div class="d-inline-block float-left">
                    <blockie class="blockie" v-bind:data="direction.address" />
                </div>
                <div class="d-inline-block ml-3">
                    <span class="d-block label">{{direction.label}}:</span>
                    <span class="d-block">{{direction.address}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Blockie from './../Blockie'

export default {
  name: 'tx-value-transfer',
  components: {
    Blockie
  },
  props: ['valueTransfer'],
  computed: {
    ...mapState({
      accountAddress: state => state.account.address,
      accountCurrency: state => state.account.currency
    }),
    formattedTotal: function () {
      if (this.accountCurrency.symbol_before) {
        return this.accountCurrency.symbol + this.valueTransfer.total
      }
      return this.valueTransfer.total + this.accountCurrency.symbol
    },
    txClass: function () {
      if (this.direction.failed) {
        return 'failed'
      } else if (this.direction.incoming) {
        return 'incoming'
      }
      return 'default'
    },
    direction: function () {
      let address = this.accountAddress
      if (this.valueTransfer.from === this.valueTransfer.to && this.valueTransfer.from === address) {
        return {
          label: 'Self',
          address: this.valueTransfer.to,
          failed: !this.valueTransfer.failed,
          incoming: false,
          sign: '-'
        }
      } else if (this.valueTransfer.from === this.accountAddress) {
        return {
          label: 'To',
          address: this.valueTransfer.to,
          failed: this.valueTransfer.failed,
          incoming: false,
          sign: '-'
        }
      } else if (this.valueTransfer.to === address) {
        return {
          label: 'From',
          address: this.valueTransfer.from,
          failed: this.valueTransfer.failed,
          incoming: true,
          sign: '+'
        }
      } else {
        return {
          label: 'To',
          address: this.valueTransfer.to,
          failed: this.valueTransfer.failed,
          incoming: true,
          sign: '+'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

    .tx-content {

    }

    .blockie {
        width: 40px;
        height: 40px;
    }

    .value {
        font-size: 3rem;
    }

    .label {
        color: $darkGrey;
    }

    .total {
        color: $lightGrey
    }

    .incoming {
        color: $incoming;
    }

    .failed {
        color: $failed;
    }

    .value-container {
        img {
            width: 25px;
            height: 25px;
        }
    }
</style>
