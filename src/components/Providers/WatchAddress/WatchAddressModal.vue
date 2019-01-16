<template>
    <modal height="auto" :adaptive="true" name="watchAddressModal">
        <div class="modal-content">
            <div class="row justify-content-center">
                <div class="col-sm-10">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title" id="exampleModalLabel">{{ $t('address_label') }}</h5>
                        <close-modal v-bind:modal-name="'watchAddressModal'"/>
                    </div>
                    <div class="modal-body text-center">
                        <qr-code-reader v-on:childToParent="onQrCodeAddress" v-if="showQrReader"/>
                        <short-account-info  v-if="!errors.has('address') && !showQrReader" v-bind:address="combinedAddress"/>
                        <input v-if="!showQrReader" v-model="address"
                               v-validate="{ required: true, regex: /^0x[a-fA-F0-9]{40,42}$/ }"
                               type="text"
                               name="address"
                               placeholder="0x12e3e45Dd67F8901df23457325c034cB342113"
                               class="form-control wrapper mt-3"
                               autocomplete="off"
                               id="address">
                        <span class="wrapper error" v-show="errors.has('address')">{{ errors.first('address') }}</span>
                    </div>
                    <div class="modal-footer justify-content-between text-center">
                        <button type="button" class="btn btn-simple btn-lg" @click="showQrReader = !showQrReader">{{ showQrReader ? 'Close' : 'Scan QR' }}</button>
                        <button :disabled="errors.has('address')" type="button" class="btn btn-tokenary btn-lg" @click="getValue">{{ $t('watch') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import { mapActions } from 'vuex'
import { ACCOUNT_UPDATE_ADDRESS } from '../../../store/modules/actions.type'
import CloseModal from '../../CloseModal'
import Blockie from '../../Blockie'
import QrCodeReader from '../../Shared/QrCodeReader'
import { getTokens } from '../../../api'
import ShortAccountInfo from '../ShortAccountInfo'

export default {
  name: 'watch-address-modal',
  components: {
    ShortAccountInfo,
    CloseModal,
    Blockie,
    QrCodeReader
  },
  data () {
    return {
      address: '',
      addressEth: '',
      addressUsd: '',
      showQrReader: false
    }
  },
  methods: {
    ...mapActions([
      ACCOUNT_UPDATE_ADDRESS
    ]),
    getValue: function () {
      if (this.address !== '' && !this.errors.has('address')) {
        this[ACCOUNT_UPDATE_ADDRESS]({
          address: this.address,
          type: 'WATCH'
        })
        this.$modal.hide('watchAddressModal')
        this.$router.replace({ name: 'dashboard', params: { address: this.address } })
      }
    },
    getAddressEth (address) {
      getTokens(address, 'USD').then(res => {
        this.addressEth = res.data.ethereum.balance
        this.addressUsd = res.data.ethereum.total_value_usd
      })
    },
    onQrCodeAddress (value) {
      this.address = value
      this.showQrReader = false
    }
  },
  computed: {
    combinedAddress: function () {
      return {
        address: this.address,
        balance: this.addressEth,
        balanceUsd: this.addressUsd
      }
    }
  },
  watch: {
    address: function (e) {
      if (e.search(/^0x[a-fA-F0-9]{40,42}$/) !== -1) {
        this.getAddressEth(e)
      }
    }
  }
}
</script>

<style scoped>
    .form-control {
        font-size: 1.5rem;
        height: 30px;
    }
</style>

<i18n>
    {
        "en": {
            "address_label": "Paste the address (only view mode)",
            "watch": "Watch",
            "or": "or",
            "metamask_inject": "Please inject",
            "metamask_unlock": "Please unlock you metamask account",
            "metamask_button": "Use MetaMask account"
        },
        "ru": {
            "address_label": "Вставьте сюда адрес (только режим просмотра)",
            "watch": "Поиск",
            "or": "или",
            "metamask_inject": "Установите расширение",
            "metamask_unlock": "Пожалуйста разблокируйте расширение",
            "metamask_button": "Использовать аккаунт MetaMask"
        }
    }
</i18n>
