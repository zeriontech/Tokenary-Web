<template>
    <div class="card">
        <div class="card-body">
            <div v-for="(transfer, index) in transaction.transfers" v-bind:key="index" class="row mt-3">
                <div class="col-sm">
                    <tx-value-transfer v-bind:valueTransfer="transfer"/>
                </div>
            </div>
            <div v-if="transaction.original.value > 0" class="row mt-2">
                <div class="col-sm">
                    <tx-value-transfer v-bind:valueTransfer="transaction.original"/>
                </div>
            </div>
            <div v-if="transaction.type === 'contract_execution'" class="row mt-2">
                <div class="col-sm-12">
                    <div class="tx-title">
                        Contract:
                    </div>
                    <div class="tx-content">
                        <blockie class="blockie" v-bind:data="transaction.original.to" />
                        <span class="ml-3">{{transaction.original.to}}</span>
                    </div>
                </div>
            </div>
            <div v-if="transaction.type === 'contract_deployment'" class="row mt-2">
                <div class="col-sm-12">
                    <div class="tx-title">
                        Contract:
                    </div>
                    <div class="tx-content">
                        <blockie class="blockie" v-bind:data="transaction.contract" />
                        <span class="ml-3">{{transaction.contract}}</span>
                    </div>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-sm-12">
                    <div class="tx-title">
                        Address:
                    </div>
                    <div class="tx-content">
                        <blockie class="blockie" v-bind:data="transaction.from" />
                        <span class="ml-3">{{transaction.from}}</span>
                    </div>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-sm-12">
                    <div class="tx-title">
                        {{$t('hash')}}:
                    </div>
                    <div class="tx-content">
                        {{transaction.hash}}
                    </div>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-sm-12">
                    <div class="tx-title">
                        Date:
                    </div>
                    <div class="tx-content">
                        <span>{{formattedDate}}</span>
                    </div>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-sm-12">
                    <div class="tx-title">
                        Block:
                    </div>
                    <div class="tx-content">
                        <span>#{{transaction.blockNumber}}</span>
                    </div>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-sm-12">
                    <div class="tx-title">
                        Fee:
                    </div>
                    <div class="tx-content">
                        <span>{{transaction.ethFee}} ETH ≈ {{formattedFee}}</span>
                    </div>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-sm-12">
                    <div class="tx-title">
                        More info:
                    </div>
                    <div class="tx-content">
                        <a target="_blank" :href="'//etherscan.io/tx/'+transaction.hash">Etherscan</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import TransactionValue from '../components/Transaction/TransactionValue'
import TransactionTimestamp from '../components/Transaction/TransactionTimestamp'
import TransactionDirection from '../components/Transaction/TransactionDirection'
import TransactionFee from '../components/Transaction/TransactionFee'
import TransactionHash from '../components/Transaction/TransactionHash'
import TransactionImage from '../components/Transaction/TransactionImage'
import TransactionStatus from '../components/Transaction/TransactionStatus'
import TransactionGas from '../components/Transaction/TransactionGas'
import TransactionTransfers from '../components/Transaction/TransactionTransfers'
import Blockie from './Blockie'
import moment from 'moment'
import TxValueTransfer from './Transaction/TxValueTransfer'

export default {
  name: 'transaction-info',
  components: {
    TxValueTransfer,
    Blockie,
    TransactionValue,
    TransactionTimestamp,
    TransactionDirection,
    TransactionFee,
    TransactionHash,
    TransactionImage,
    TransactionStatus,
    TransactionGas,
    TransactionTransfers
  },
  props: ['transaction', 'currentAccount'],
  computed: {
    ...mapState({
      accountAddress: state => state.account.address,
      accountCurrency: state => state.account.currency
    }),
    formattedDate: function () {
      // TODO: Need to make proper getter for transaction
      const date = moment.unix(this.transaction.timestamp)
      return date.format('MMMM DD YYYY, hh:mm')
    },
    formattedFee: function () {
      if (this.accountCurrency.symbol_before) {
        return this.accountCurrency.symbol + this.transaction.fee
      }
      return this.transaction.fee + this.accountCurrency.symbol
    },
    direction: function () {
      let address = this.accountAddress.toLowerCase()
      if (this.transaction.from === this.transaction.to && this.transaction.from === address) {
        return {
          type: this.transaction.type,
          label: 'Self',
          address: this.transaction.to,
          failed: !this.transaction.hasSucceed,
          incoming: false,
          sign: '-'
        }
      } else if (this.transaction.from === this.accountAddress) {
        return {
          type: this.transaction.type,
          label: 'To',
          address: this.transaction.to,
          failed: !this.transaction.hasSucceed,
          incoming: false,
          sign: '-'
        }
      } else if (this.transaction.to === address) {
        return {
          type: this.transaction.type,
          label: 'From',
          address: this.transaction.from,
          failed: !this.transaction.hasSucceed,
          incoming: true,
          sign: '+'
        }
      } else if (this.transaction.contract !== null) {
        return {
          type: this.transaction.type,
          label: 'Address',
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

<style scoped lang="scss">
    .wrapper span {
        display: block;
    }

    .tx-title {
        color: $darkGrey;
    }

    .blockie {
        width: 40px;
        height: 40px;
    }

</style>

<i18n>
    {
        "en": {
            "hash": "Hash",
            "datetime": "Datetime",
            "back": "Back",
            "status": "Status",
            "status_succeed": "Succeed",
            "status_failed": "Failed",
            "from": "From",
            "to": "To",
            "value": "Value"
        },
        "ru": {
            "hash": "Хэш транзакции",
            "datetime": "Дата",
            "back": "Назад",
            "status": "Статус",
            "status_succeed": "Успешно",
            "status_failed": "Не успешно",
            "from": "Отправитель",
            "to": "Получатель",
            "value": "Сумма"
        }
    }
</i18n>
