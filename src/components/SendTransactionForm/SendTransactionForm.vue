<template>
    <modal height="auto" :adaptive="true" @before-open="beforeOpenSendForm" name="sendModal">
        <div class="modal-content">
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title" id="exampleModalLabel">Send tokens</h5>
                        <close-modal v-bind:modal-name="'sendModal'"/>
                    </div>
                    <div class="modal-body">
                        <div v-if="!confirmSend && !this.currentTransactionHash && !error">
                            <v-wait for="fetching tokens" message='Loading'>
                                <template slot='waiting'>
                                    <spinner/>
                                </template>
                                <div class="form-row">
                                    <div class="form-group col-md-12">
                                        <label for="token">{{ $t('token_label')}}</label>
                                        <select v-model="selected" class="form-control" id="token">
                                            <option disabled value="">{{ $t('token_placeholder')}}</option>
                                            <option v-bind:value="ethereum">
                                                {{ethereum && tokenToStr(ethereum)}}
                                                {{ tokenTotal(ethereum) }}
                                            </option>
                                            <option v-for="(token, i) in orderedTokens"
                                                    v-bind:value="token" v-bind:key="i">
                                                {{token && tokenToStr(token) }}
                                                {{ tokenTotal(token) }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </v-wait>

                            <div class="form-row">
                                <div class="form-group col-md-12">
                                    <label for="address">{{ $t('address_label')}}</label>
                                    <a href="#" class="send-entire alert-link" @click="showQrReader = !showQrReader">
                                        {{ showQrReader ? 'Close' : '' }}
                                        Qr Code
                                    </a>

                                    <qr-code-reader v-on:childToParent="onQrCodeAddress" v-if="showQrReader"/>

                                    <a href="#" class="alert-link" @click="to = ''">
                                        {{$t('clear_button')}}
                                    </a>

                                    <input v-model="to"
                                           v-validate="{ is_not: this.accountAddress, is_address: true }"
                                           name="address"
                                           type="text"
                                           placeholder="0x12e3e45Dd67F8901df23457325c034cB342113"
                                           class="form-control"
                                           id="address"
                                           autocomplete="off"
                                           v-on:input='checkAddress'>
                                    <span class="error"
                                          v-show="errors.has('address')">{{ errors.first('address') }}</span>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-md-12">
                                    <label for="amount">{{ $t('amount_label')}}</label>

                                    <a href="#" class="send-entire alert-link" @click="entire">
                                        {{$t('entire_button')}}
                                    </a>

                                    <input v-model="value"
                                           v-validate="{ required: true, regex: /^[0-9]*\.?[0-9]*$/ }"
                                           name="amount"
                                           type="text"
                                           placeholder="0.00001"
                                           class="form-control"
                                           id="amount"
                                           v-on:input='checkAmount'>
                                    <span class="error"
                                          v-show="errors.has('amount')">{{ errors.first('amount') }}</span>
                                </div>
                            </div>

                            <v-wait for="load blockhain stats" message='Loading'>
                                <template slot='waiting'>
                                    <spinner/>
                                </template>
                                <div class="form-group row">
                                    <label class="col-sm-2">{{ $t('fee_label')}}</label>
                                    <div class="col-sm-10">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input"
                                                   type="radio"
                                                   name="exampleRadios"
                                                   id="exampleRadios1"
                                                   v-bind:value="fromWei(blockChainStats.low, 'gwei')"
                                                   v-model="gas">
                                            <label class="form-check-label" for="exampleRadios1">
                                                {{ $t('slow')}} ({{ formattedTime(blockChainStats.lowWait) }})
                                            </label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input"
                                                   type="radio"
                                                   name="exampleRadios"
                                                   id="exampleRadios2"
                                                   v-bind:value="fromWei(blockChainStats.fast, 'gwei')"
                                                   v-model="gas">
                                            <label class="form-check-label" for="exampleRadios2">
                                                {{ $t('average')}} ({{ formattedTime(blockChainStats.fastWait) }})
                                            </label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input"
                                                   type="radio"
                                                   name="exampleRadios"
                                                   id="exampleRadios3"
                                                   v-bind:value="fromWei(blockChainStats.fastest, 'gwei')"
                                                   v-model="gas">
                                            <label class="form-check-label" for="exampleRadios3">
                                                {{ $t('fast')}} ({{ formattedTime(blockChainStats.fastestWait) }})
                                            </label>
                                        </div>

                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input"
                                                   type="checkbox"
                                                   name="exampleRadios"
                                                   id="exampleRadios4"
                                                   v-model="customGas">
                                            <label class="form-check-label" for="exampleRadios4">
                                                Custom
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </v-wait>

                            <div>
                                <button v-on:click="showAdvanced" class="btn btn-primary btn-lg">
                                    {{ advancedForm ? $t('hide') : $t('show') }} advanced
                                </button>

                                <div v-if="advancedForm">
                                    <div class="form-row">
                                        <div class="form-group col-md-12">
                                            <label for="data">{{ $t('data_label')}}</label>

                                            <input v-model="data"
                                                   name="data"
                                                   type="text"
                                                   placeholder="0x"
                                                   class="form-control"
                                                   v-validate="{ regex: /([0-9]|[a-f])/gim }"
                                                   id="data"
                                                   :disabled="this.selected.address !== '0x0000000000000000000000000000000000000000'"
                                                   v-on:input='checkAmount'>
                                            <span class="error"
                                                  v-show="errors.has('data')">{{ errors.first('data') }}</span>
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group col-md-12">
                                            <label for="gas">Gas price (gwei)</label>

                                            <input v-model="gas"
                                                   name="gas"
                                                   type="text"
                                                   placeholder="0.00001"
                                                   class="form-control"
                                                   id="gas"
                                                   :disabled="!customGas"
                                                   v-on:input='checkAmount'>
                                            <span class="error"
                                                  v-show="errors.has('gas')">{{ errors.first('gas') }}</span>
                                        </div>
                                    </div>

                                    <div class="form-check">
                                        <input v-model="autoGasLimit"
                                               type="checkbox"
                                               class="form-check-input"
                                               id="exampleCheck1">
                                        <label class="form-check-label" for="exampleCheck1">
                                            Automatically Calculate Gas Limit
                                        </label>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-12">
                                            <label for="gasLimit">Gas limit</label>

                                            <input v-model="gasLimit"
                                                   name="gasLimit"
                                                   type="text"
                                                   class="form-control"
                                                   id="gasLimit"
                                                   v-on:input='checkAmount'
                                                   :disabled="autoGasLimit">
                                            <span class="error" v-show="errors.has('gasLimit')">{{ errors.first('gasLimit') }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-12 text-center">
                                <span v-if="fee !== null">{{ $t('fee') }}: {{formattedTotal(feeCurrency, accountCurrency.decimals_min, accountCurrency.decimals_max)}}{{accountCurrency.symbol}} ({{ fee }} ETH)</span>
                            </div>

                            <div class="col-md-12 text-center">
                                <span v-if="totalString !== null">{{ $t('total') }}: {{ totalString }}</span>
                            </div>

                            <div v-if="bigAmount" class="col-md-12 text-center text-danger">
                                <span>you do not have that much {{ selected.symbol }}</span>
                            </div>
                            <div v-if="notEnoughEther" class="col-md-12 text-center text-danger">
                                <span>you do not have that much ETH for fee</span>
                            </div>
                            <div v-if="feeError" class="col-md-12 text-center text-danger">
                                <span>It seems that this transaction can not be executed</span>
                            </div>
                        </div>
                        <div v-else-if="confirmSend">
                            <metamask-confirm-transaction v-if="providerType === 'METAMASK'"/>
                            <ledger-confirm-transaction v-if="providerType === 'LEDGER'"/>
                            <wallet-connect-confirm-transaction v-if="providerType === 'WALLETCONNECT'"/>
                        </div>
                        <div v-else-if="error">
                            Canceled, try again<br>
                            <span class="text-danger">{{ error }}</span>
                        </div>
                        <div v-else-if="currentTransactionHash && currentTransactionHash !== 'mined'">
                            You transaction pending
                            <a class="pending-link" target="_blank" v-bind:href="'//etherscan.io/tx/'+this.currentTransactionHash">{{this.currentTransactionHash}}</a>
                        </div>
                        <div v-else-if="currentTransactionHash && currentTransactionHash === 'mined'">
                            You transaction mined
                            <a href="#" class="alert-link" @click="$modal.hide('sendModal')">
                                Close
                            </a>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-between text-center">
                        <button v-if="!this.currentTransactionHash && !confirmSend && !error"
                                class="btn btn-primary"
                                @click="send"
                                :disabled="!couldExecuteTransaction || emptyAddress || emptyAmount || errors.has('address') || errors.has('amount') || selected === '' || bigAmount || feeError || notEnoughEther">
                            {{ $t('send_button')}}
                        </button>
                        <button v-if="!this.currentTransactionHash && !confirmSend && error"
                                class="btn btn-primary"
                                @click="error = false">
                            Back
                        </button>
                        <button v-if="!this.currentTransactionHash && confirmSend"
                                class="btn btn-primary"
                                @click="confirmSend = false">
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { Validator } from 'vee-validate'
import { mapWaitingActions } from 'vue-wait'
import Spinner from '../Shared/Spinner'
import mixins from '../../mixins.js'
import MetamaskConfirmTransaction from '../Providers/MetaMask/MetamaskConfirmTransaction'
import LedgerConfirmTransaction from '../Providers/Ledger/LedgerConfirmTransaction'
import WalletConnectConfirmTransaction from '../Providers/WalletConnect/WalletConnectConfirmTransaction'
import { BigNumber } from 'bignumber.js'
import CloseModal from '../CloseModal'
import QrCodeReader from '../Shared/QrCodeReader'
import utils from 'web3-utils'
import { getDataString, removeHexPrefix } from '../../common/Web3'

export default {
  name: 'send-transaction-form',
  components: {
    Spinner,
    CloseModal,
    QrCodeReader,
    MetamaskConfirmTransaction,
    LedgerConfirmTransaction,
    WalletConnectConfirmTransaction
  },
  mixins: [mixins],
  data () {
    return {
      error: false,
      feeError: false,
      confirmSend: false,
      advancedForm: false,
      data: false,
      selected: '',
      emptyAddress: true,
      emptyAmount: true,
      bigAmount: false,
      notEnoughEther: false,
      gas: '',
      gasLimit: 21000,
      customGas: false,
      autoGasLimit: true,
      to: '',
      value: '',
      fee: null,
      feeCurrency: null,
      showQrReader: false,
      tokenTotal: (token) => {
        if (token && this.formattedTotal(token.total_value_usd, this.accountCurrency.decimals_min, this.accountCurrency.decimals_max) > 0) {
          return '≈ ' + this.formattedTotal(token.total_value_usd, this.accountCurrency.decimals_min, this.accountCurrency.decimals_max) + this.accountCurrency.symbol
        } else {
          return ''
        }
      }
    }
  },
  created: () => {
    Validator.extend('is_address', {
      getMessage: (field) => `The ${field} is not a valid.`,
      validate: (value) => new Promise(resolve => {
        resolve({
          valid: utils.isAddress(value)
        })
      })
    })
  },
  methods: {
    ...mapWaitingActions({
      fetchTokens: 'fetching tokens'
    }),
    ...mapActions([
      'sendTransaction',
      'populateErrors'
    ]),
    beforeOpenSendForm () {
      this.error = false
      if (this.blockChainStats.fast) {
        this.gas = this.fromWei(this.blockChainStats.fast, 'gwei')
      } else {
        this.$store.dispatch('updateBlockChainStats').then(() => {
          this.gas = this.fromWei(this.blockChainStats.fast, 'gwei')
        })
      }

      this.$store.dispatch('updateCurrentTransactionHash', { hash: null })

      if (this.selectedToken === '0x0000000000000000000000000000000000000000') {
        if (this.ethereum !== null) {
          this.selected = this.ethereum
        } else {
          this.fetchTokens().then(() => {
            this.selected = this.ethereum
          })
        }
      } else if (this.selectedToken === 'ALL') {
        this.selected = ''
      } else {
        if (this.tokens.length > 0) {
          this.tokens.forEach((item) => {
            if (item.address === this.selectedToken) {
              this.selected = item
            }
          })
        } else {
          this.fetchTokens().then(() => {
            this.tokens.forEach((item) => {
              if (item.address === this.selectedToken) {
                this.selected = item
              }
            })
          })
        }
      }
    },
    entire () {
      this.value = this.selected.balance
      this.emptyAmount = false
      this.calculateFee(true)
    },
    send: async function () {
      let contractAddress

      if (this.selected.address !== '0x0000000000000000000000000000000000000000') {
        contractAddress = this.selected.address
      } else {
        contractAddress = false
      }

      this.confirmSend = true

      this.sendTransaction(
        {
          from: this.accountAddress,
          to: this.to,
          value: this.value,
          gasPrice: utils.toWei(this.gas, 'gwei'),
          contractAddress: contractAddress,
          decimals: this.selected.decimals,
          data: this.data,
          gasLimit: this.gasLimit
        }
      ).then(() => {
        this.confirmSend = false
      })
        .catch(e => {
          this.populateErrors(e)

          this.error = e
          this.confirmSend = false
        })
    },
    calculateFee: function (entire = false) {
      this.feeError = false
      if (this.to !== '' && this.value !== '' && !isNaN(this.value) && this.selected !== '' && this.gas !== '' && utils.isAddress(this.to)) {
        let amount

        if (this.selected.address !== '0x0000000000000000000000000000000000000000') {
          amount = new BigNumber(this.value * Math.pow(10, this.selected.decimals)).toString(10)
        } else {
          amount = this.value
        }

        const gasLimit = this.autoGasLimit ? false : this.gasLimit
        this.getEstimateGas(this.accountAddress, this.to, amount, utils.toWei(this.gas, 'gwei'), this.selected.address, gasLimit, this.data).then((estimateGas) => {
          const gasPrice = new BigNumber(utils.toWei(this.gas, 'gwei') * estimateGas)
          if (this.autoGasLimit) {
            this.gasLimit = estimateGas
          }

          this.fee = utils.fromWei(gasPrice.toString(), 'ether')
          this.feeCurrency = this.fee * this.ethereum.price_usd

          if (this.selected.address === '0x0000000000000000000000000000000000000000') {
            const currentBalance = new BigNumber(this.selected.balance)
            const currentAmount = new BigNumber(this.value)
            const currentFee = new BigNumber(this.fee)

            const value = currentBalance.minus(currentAmount.plus(currentFee))
            if (entire) {
              this.value = currentBalance.minus(currentFee).toString(10)
              this.notEnoughEther = false
            } else {
              this.notEnoughEther = value.isLessThan(0)
            }
          } else {
            const transferMethodHash = '0xa9059cbb'
            this.data = getDataString(transferMethodHash, [removeHexPrefix(this.to), amount])
            this.getBalance().then((balance) => {
              const currentBalance = new BigNumber(balance)
              const currentFee = new BigNumber(this.fee)

              const value = currentBalance.minus(currentFee)
              this.notEnoughEther = value.isLessThan(0)
            })
          }
        }).catch(() => { this.feeError = true })
      }
    },
    checkAddress: function (event) {
      this.emptyAddress = event.target.value === ' '
      this.calculateFee()
    },
    checkAmount: function () {
      this.emptyAmount = this.value === ' '

      if (this.selected !== '' && this.emptyAmount) {
        let currentBalance = new BigNumber(this.selected.balance)
        let currentAmount = new BigNumber(this.value)
        this.bigAmount = currentBalance.isLessThan(currentAmount)
      } else {
        this.bigAmount = false
      }

      this.calculateFee()
    },
    showAdvanced () {
      this.advancedForm = !this.advancedForm
      this.data = this.advancedForm ? '0x' : false
      this.calculateFee()
    },
    onQrCodeAddress (value) {
      this.to = value
      this.showQrReader = false
      this.emptyAddress = false
      this.calculateFee()
    }
  },
  watch: {
    gas: function () {
      this.calculateFee()
    },
    selected: function () {
      this.value = ''
      if (this.selected.address === '0x0000000000000000000000000000000000000000') {
        this.data = '0x'
      } else {
        this.data = ''
      }
      this.calculateFee()
      this.checkAmount()
    },
    autoGasLimit: function () {
      this.calculateFee()
    },
    data: function () {
      this.calculateFee()
    }
  },
  computed: {
    totalString: {
      get () {
        let totalString = null

        if (this.to !== '' && this.value !== '' && !isNaN(this.value) && this.selected !== '' && this.gas !== '' && utils.isAddress(this.to) && this.fee) {
          let currentAmount = new BigNumber(this.value)
          const currentFee = new BigNumber(this.fee)
          if (this.selected.address === '0x0000000000000000000000000000000000000000') {
            const totalCurrency = this.formattedTotal(currentAmount.plus(currentFee) * this.selected.price_usd, this.accountCurrency.decimals_min, this.accountCurrency.decimals_max) + this.accountCurrency.symbol
            totalString = totalCurrency + ' (' + currentAmount + ' ' + this.selected.symbol + ') '
          } else {
            let totalCurrency = this.formattedTotal((currentAmount * this.selected.price_usd) + this.feeCurrency, this.accountCurrency.decimals_min, this.accountCurrency.decimals_max)
            if (totalCurrency > 0) {
              totalCurrency = totalCurrency + this.accountCurrency.symbol
            } else {
              totalCurrency = ''
            }
            totalString = totalCurrency + ' (' + currentAmount + ' ' + this.selected.symbol + ' + ' + currentFee + ' ETH)'
          }
        }
        return totalString
      }
    },
    ...mapState({
      accountAddress: state => state.account.address,
      providerType: state => state.account.type,
      accountCurrency: state => state.account.currency,
      blockChainStats: state => state.blockChainStats
    }),
    ...mapState([
      'tokens',
      'ethereum',
      'currentTransactionHash',
      'transactions',
      'selectedToken'
    ]),
    ...mapGetters([
      'getEstimateGas',
      'getBalance',
      'orderedTokens',
      'couldExecuteTransaction'
    ])
  }
}
</script>

<style scoped>
    select {
        width: 100%;
        height: 30px !important;
    }

    .form-control {
        font-size: 1.5rem;
        height: 30px;
    }

    .error {
        color: red
    }

    .send-entire {
        margin-left: 10px;
    }

    .pending-link {
        word-wrap: break-word;
    }
</style>

<i18n>
    {
        "en": {
            "token_label": "Token",
            "token_placeholder": "Select a token...",
            "amount_label": "Amount",
            "entire_button": "Send max",
            "address_label": "Recipient Address",
            "fee_label": "Speed",
            "fee": "Fee",
            "slow": "Slow",
            "average": "Average",
            "fast": "Fast",
            "send_button": "Send",
            "data_label": "Data",
            "hide": "Hide",
            "show": "Show",
            "total": "Total",
            "clear_button": "Clear"
        },
        "ru": {
            "token_label": "Токен",
            "token_placeholder": "Выбрать токен...",
            "amount_label": "Сумма",
            "entire_button": "Отправить все",
            "address_label": "Адрес получателя",
            "fee_label": "Скорость",
            "fee": "Комиссия",
            "slow": "Медленно",
            "average": "Средне",
            "fast": "Быстро",
            "send_button": "Отправить",
            "data_label": "Данные",
            "hide": "Скрыть",
            "show": "Показать",
            "total": "Итого",
            "clear_button": "Очистить"
        }
    }
</i18n>
