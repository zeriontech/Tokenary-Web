<template>
    <v-wait for='fetch transaction by hash'>
        <template slot='waiting'>
            <spinner/>
        </template>
        <div class="container">
            <div class="row">
                <div class="col-sm-8 offset-2 text-center">
                    <div class="float-left icon-wrapper" @click="backPage">
                        <arrow-left-icon />
                    </div>
                    <h2 v-if="filteredTransfer.type === 'contract_execution'">Contract Execution</h2>
                    <h2 v-else-if="filteredTransfer.type === 'contract_deployment'"></h2>
                    <h2 v-else>{{ $t('transaction')}}</h2>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-sm-8 offset-2">
                    <transaction-info
                            v-bind:transaction="filteredTransfer"
                            v-bind:currentAccount="accountAddress"
                    ></transaction-info>
                </div>

            </div>
        </div>
    </v-wait>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import TransactionInfo from '../TransactionInfo'
import { mapWaitingActions } from 'vue-wait'
import Spinner from '../Shared/Spinner'
import { ArrowLeftIcon } from 'vue-feather-icons'

export default {
  components: {
    TransactionInfo,
    Spinner,
    ArrowLeftIcon
  },
  name: 'transaction',
  computed: {
    ...mapGetters([
      'filteredTransfer'
    ]),
    ...mapState({
      accountAddress: state => state.account.address
    })
  },
  created () {
    if (this.$route.params.hash) {
      this.getTransactionByHash({ hash: this.$route.params.hash })
    }
  },
  methods: {
    ...mapWaitingActions({
      getTransactionByHash: 'fetch transaction by hash'
    }),
    backPage () {
      // Todo проверять есть ли в history маршрут и убирать кнопку назад
      // this.$router.go(-1)
      this.$router.replace({ name: 'dashboard', params: { address: this.accountAddress } })
    }
  }
}
</script>

<i18n>
    {
        "en": {
            "transaction": "Transaction",
            "contract_execution": "Contract Execution",
            "contract_deployment": "Contract Deployment",
            "back": "Back"
        },
        "ru": {
            "transaction": "Транзакция",
            "contract_execution": "Выполнение контракта",
            "contract_deployment": "Создание контракта",
            "back": "Назад"
        }
    }
</i18n>

<style lang="scss">
    .header {
        text-align: center;
        h2, button {
            display: inline-block;
        }
    }
</style>
