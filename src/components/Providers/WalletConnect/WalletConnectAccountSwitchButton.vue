<template>
    <div>
        <button v-if="
        accountType === 'WATCH' && hasWalletConnectLocal"
                class="btn btn-walletconnect-inverse ml-3"
                @click="connect">
            <img class="btn-image-inner" src="../../../assets/walletconnect-logo.svg" alt="Connect via WalletConnect">
            Connect to wallet
        </button>
        <wallet-connect-modal/>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { ACCOUNT_UPDATE_ADDRESS } from '../../../store/modules/actions.type'
import WalletConnectModal from './WalletConnectModal'

export default {
  name: 'wallet-connect-account-switch-button',
  components: {
    WalletConnectModal
  },
  computed: {
    ...mapGetters([
      'hasWalletConnectLocal'
    ]),
    ...mapState({
      accountAddress: state => state.account.address,
      providerAddress: state => state.metaMask.address ? state.metaMask.address.address : '',
      accountType: state => state.account.type,

      metamaskInject: state => state.metaMask.inject,
      metamaskUserAccess: state => state.metaMask.userAccess
    })
  },
  methods: {
    ...mapActions([
      ACCOUNT_UPDATE_ADDRESS,
      'initSession'
    ]),
    connect () {
      this.initSession()

      this.$modal.show('walletconnectModal')
    }
  }
}
</script>

<style lang="scss" scoped>
    label {
        margin-bottom: 0;
    }

    .btn-walletconnect-inverse {
        background-color: white;
        border-color: $walletconnect;
        color: $black;
        font-size: 1.5rem;
        .btn-image-inner {
            stroke: white;
            fill: white;
        }
        &:hover {
            background-color: $walletconnect;
            border-color: $walletconnect;
            color: white;
            .btn-image-inner {
                stroke: white;
                fill: white;
            }
        }
        &:active {
            background-color: darken($walletconnect, 5%);
            border-color: darken($walletconnect, 5%);
            color:white;
            box-shadow: 0 0 11px rgba(33,33,33,.2);
            .btn-image-inner {
                stroke: white;
                fill: white;
            }
        }
    }

    .btn-image-inner {
        width: 15px;
        height: 15px;
        margin: 4px;
    }

</style>

<i18n>
    {
        "en": {
            "wc_another_account": "Connect to wallet"
        },
        "ru": {
            "wc_another_account": "Подключиться"
        }
    }
</i18n>
