<template>
    <div class="modal-content">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="modal-header justify-content-center">
                    <h5 class="modal-title" id="exampleModalLabel">Send {{ collectible.name }}
                        (ID:{{ collectible.token_id }})</h5>
                    <button type="button" class="close icon-wrapper" @click="$emit('close')" aria-label="Close">
                        <XIcon />
                    </button>
                </div>
                <div class="modal-body">
                    <div v-if="!confirmSend && !this.currentTransactionHash && !error">
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
                                </div>
                            </div>
                        </v-wait>

                        <div class="col-md-12 text-center">
                            <span v-if="fee !== null">{{ $t('fee') }}: {{formattedTotal(feeCurrency, accountCurrency.decimals_min, accountCurrency.decimals_max)}}{{accountCurrency.symbol}} ({{ fee }} ETH)</span>
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
                        <a class="pending-link" target="_blank"
                           v-bind:href="'//etherscan.io/tx/'+this.currentTransactionHash">{{this.currentTransactionHash}}</a>
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
                            :disabled="!couldExecuteTransaction || emptyAddress || errors.has('address')  || notEnoughEther">
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
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { Validator } from 'vee-validate'
import Spinner from '../Shared/Spinner'
import mixins from '../../mixins.js'
import MetamaskConfirmTransaction from '../Providers/MetaMask/MetamaskConfirmTransaction'
import LedgerConfirmTransaction from '../Providers/Ledger/LedgerConfirmTransaction'
import WalletConnectConfirmTransaction from '../Providers/WalletConnect/WalletConnectConfirmTransaction'
import { BigNumber } from 'bignumber.js'
import CloseModal from '../CloseModal'
import QrCodeReader from '../Shared/QrCodeReader'
import utils from 'web3-utils'
import { XIcon } from 'vue-feather-icons'

export default {
  name: 'send-collectible-form',
  components: {
    Spinner,
    CloseModal,
    QrCodeReader,
    MetamaskConfirmTransaction,
    LedgerConfirmTransaction,
    WalletConnectConfirmTransaction,
    XIcon
  },
  mixins: [mixins],
  props: ['collectible', 'gasStart', 'nftVersion'],
  data () {
    return {
      error: false,
      feeError: false,
      confirmSend: false,
      data: false,
      emptyAddress: true,
      notEnoughEther: false,
      gas: this.gasStart,
      gasLimit: 51000,
      autoGasLimit: true,
      to: '',
      fee: null,
      feeCurrency: null,
      showQrReader: false
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
    ...mapActions([
      'sendTransaction',
      'populateErrors'
    ]),
    send: async function () {
      this.confirmSend = true

      this.sendTransaction(
        {
          from: this.accountAddress,
          to: this.to,
          value: this.collectible.token_id,
          gasPrice: utils.toWei(this.gas, 'gwei'),
          contractAddress: this.collectible.contract,
          decimals: 0,
          data: this.data,
          gasLimit: this.gasLimit,
          nftVersion: this.nftVersion
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
    calculateFee: function () {
      this.feeError = false
      if (this.to !== '' && this.collectible.token_id !== '' && !isNaN(this.collectible.token_id) && this.gas !== '' && utils.isAddress(this.to)) {
        this.getEstimateGas(this.accountAddress,
          this.to,
          this.collectible.token_id,
          utils.toWei(this.gas, 'gwei'),
          this.collectible.contract,
          false,
          this.data,
          this.nftVersion
        ).then((estimateGas) => {
          const gasPrice = new BigNumber(utils.toWei(this.gas, 'gwei') * estimateGas)
          this.gasLimit = estimateGas

          this.fee = utils.fromWei(gasPrice.toString(), 'ether')
          this.feeCurrency = this.fee * this.ethereum.price_usd
        }).catch((e) => {
          console.log(e)
          this.feeError = true
        })
      }
    },
    checkAddress: function (event) {
      this.emptyAddress = event.target.value === ' '
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
    }
  },
  computed: {
    ...mapState({
      accountAddress: state => state.account.address,
      providerType: state => state.account.type,
      accountCurrency: state => state.account.currency,
      blockChainStats: state => state.blockChainStats
    }),
    ...mapState([
      'ethereum',
      'currentTransactionHash'
    ]),
    ...mapGetters([
      'getEstimateGas',
      'couldExecuteTransaction',
      'getNftVersionByToken'
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
