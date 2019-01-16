<template>
    <modal height="auto" :adaptive="true" name="metamaskModal">
        <div class="modal-content">
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title" id="exampleModalLabel">Connect MetaMask</h5>
                        <close-modal v-bind:modal-name="'metamaskModal'"/>
                    </div>
                    <div class="modal-body text-center">
                        <p v-if="!metamaskInject">
                            {{ $t('metamask_inject') }}
                            <a href="https://metamask.io?utm_source=tokenary">MetaMask</a>
                            (Refresh after installation)
                        </p>
                        <p v-if="!isMainNetwork && metamaskUserAccess">
                            {{ $t('metamask_network') }}
                        </p>
                        <p v-if="metamaskInject && !metamaskUserAccess">{{ $t('metamask_user_access') }}</p>
                        <short-account-info v-if="metamaskInject && metamaskUserAccess && providerAddress" v-bind:address="providerAddress" />
                    </div>
                    <div class="modal-footer justify-content-between text-center">
                        <button v-if="metamaskInject && metamaskUserAccess && isMainNetwork" class="btn btn-metamask"
                                @click="useMetaMask">
                            {{ $t('metamask_button') }}
                        </button>
                        <button v-if="metamaskInject && !metamaskUserAccess" class="btn btn-metamask"
                                @click="reconnect">
                            Reconnect
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ACCOUNT_UPDATE_ADDRESS } from '../../../store/modules/actions.type'
import CloseModal from '../../CloseModal'
import Blockie from '../../Blockie'
import ShortAccountInfo from '../ShortAccountInfo'

export default {
  name: 'meta-mask-modal',
  components: {
    ShortAccountInfo,
    CloseModal,
    Blockie
  },
  computed: {
    ...mapGetters([
      'getAccountCurrencyName',
      'getAccountCurrencySymbol'
    ]),
    ...mapState({
      isMainNetwork: state => state.metaMask.networkId === 1,
      providerAddress: state => state.metaMask.address,
      metamaskInject: state => state.metaMask.inject,
      metamaskUserAccess: state => state.metaMask.userAccess
    })
  },
  methods: {
    ...mapActions([
      ACCOUNT_UPDATE_ADDRESS,
      'getMetaMaskAccounts'
    ]),
    useMetaMask () {
      this[ACCOUNT_UPDATE_ADDRESS]({
        address: this.providerAddress.address,
        type: 'METAMASK'
      })
      this.$modal.hide('metamaskModal')
      this.$router.replace({ name: 'dashboard', params: { address: this.providerAddress.address } })
    },
    reconnect () {
      this.getMetaMaskAccounts()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<i18n>
    {
        "en": {
            "metamask_cancel": "Cancel",
            "metamask_inject": "Please inject",
            "metamask_unlock": "Please unlock you metamask account",
            "metamask_network": "Please switch to Main Ethereum Network.",
            "metamask_button": "Connect",
            "metamask_user_access": "Please give this page access to view your current account address with MetaMask"
        },
        "ru": {
            "metamask_cancel": "Отменить",
            "metamask_inject": "Установите расширение",
            "metamask_unlock": "Пожалуйста разблокируйте расширение",
            "metamask_network": "Пожалуйста используйте основную сеть",
            "metamask_button": "Использовать",
            "metamask_user_access": "Пожалуйста разблокируйте MetaMask"
        }
    }
</i18n>
