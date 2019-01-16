<template>
    <modal height="auto" :adaptive="true" @before-close="beforeClose" name="walletconnectModal">
        <div class="modal-content">
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title" id="exampleModalLabel">Connect with WalletConnect</h5>
                        <close-modal v-bind:modal-name="'walletconnectModal'"/>
                    </div>
                    <div class="modal-body text-center">
                        <qrcode-vue v-if="walletConnectUri !== null && !walletConnectAddresses"
                                    :value="walletConnectUri" :size="200" class="wrapper"/>
                        <short-account-info v-if="walletConnectAddresses" v-bind:address="walletConnectAddresses"/>
                        <!--<div class="form-group row">-->
                            <!--<div v-bind:key="key" v-for="(item, key) in walletConnectAddresses"-->
                                 <!--v-if="typeof walletConnectAddresses !== 'undefined' && walletConnectAddresses.length > 0"-->
                                 <!--class="form-check form-check-inline">-->
                                <!--<input class="form-check-input"-->
                                       <!--type="radio"-->
                                       <!--name="exampleRadios"-->
                                       <!--id="key"-->
                                       <!--v-bind:value="item.address"-->
                                       <!--v-model="address">-->
                                <!--<label class="form-check-label" for="key">-->
                                    <!--{{ item.address }}-->
                                    <!--<v-wait for="fetch balance">-->
                                        <!--<template slot='waiting'>-->
                                            <!--LOADING-->
                                            <!--<spinner/>-->
                                        <!--</template>-->
                                        <!--{{ item.balance }}ETH-->
                                        <!--{{ item.balanceUsd }}USD-->
                                    <!--</v-wait>-->
                                <!--</label>-->
                            <!--</div>-->
                        <!--</div>-->
                    </div>
                    <div class="modal-footer justify-content-between text-center">
                        <button type="button" class="btn btn-simple btn-lg"
                                @click="resetWalletConnect">
                            Reconnect
                        </button>
                        <button v-if="walletConnectAddresses" class="btn btn-walletconnect"
                                @click="useWalletConnect">
                            Connect
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import CloseModal from '../../CloseModal'
import { ACCOUNT_UPDATE_ADDRESS } from '../../../store/modules/actions.type'
import Blockie from '../../Blockie'
import QrcodeVue from 'qrcode.vue'
import Spinner from '../../Shared/Spinner'
import ShortAccountInfo from '../ShortAccountInfo'

export default {
  name: 'wallet-connect-modal',
  data () {
    return {
      address: null
    }
  },
  components: {
    ShortAccountInfo,
    CloseModal,
    Blockie,
    QrcodeVue,
    Spinner
  },
  computed: {
    ...mapState({
      walletConnectUri: state => state.walletConnect.uri,
      walletConnectAddresses: state => (typeof state.walletConnect.addresses !== 'undefined' && state.walletConnect.addresses.length > 0) ? state.walletConnect.addresses[0] : false
    })
  },
  methods: {
    ...mapActions([
      ACCOUNT_UPDATE_ADDRESS,
      'createWebConnector',
      'stopLastListener',
      'resetStateWalletConnect',
      'initSession'
    ]),
    resetWalletConnect () {
      this.resetStateWalletConnect()
      this.initSession()
    },
    useWalletConnect () {
      this[ACCOUNT_UPDATE_ADDRESS]({
        address: this.walletConnectAddresses.address,
        type: 'WALLETCONNECT'
      })
      this.$modal.hide('walletconnectModal')
      this.$router.replace({ name: 'dashboard', params: { address: this.walletConnectAddresses.address } })
    },
    beforeClose () {
      this.stopLastListener()
    }
  },
  created () {
    this.createWebConnector()
  }
}
</script>

<style lang="scss" scoped>
    .btn-orange {
        background-color: $orange;
        border-color: $orange;
        color: white;
        &:hover {
            background-color: darken($orange, 5%);
            border-color: darken($orange, 5%);
        }
    }
</style>

<i18n>
    {
        "en": {
            "metamask_inject": "Please inject",
            "metamask_unlock": "Please unlock you metamask account",
            "metamask_network": "Please change to main network.",
            "metamask_button": "Use MetaMask account",
            "metamask_user_access": "Please give this page access to view your current account address with MetaMask"
        },
        "ru": {
            "metamask_inject": "Установите расширение",
            "metamask_unlock": "Пожалуйста разблокируйте расширение",
            "metamask_network": "Пожалуйста используйте основную сеть",
            "metamask_button": "Использовать аккаунт MetaMask",
            "metamask_user_access": "Пожалуйста разблокируйте MetaMask"
        }
    }
</i18n>
