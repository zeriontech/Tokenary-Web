<template>
    <div class="card">
        <img class="card-img" src="../../../assets/walletconnect-logo.svg" alt="Connect via WalletConnect">
        <div class="card-body text-center">
            <h3 class="card-title">WalletConnect</h3>
            <p class="card-text" v-html="$t('card_text')"></p>
        </div>
        <div class="card-footer text-center">
            <button @click="openModal" type="button" class="btn btn-lg btn-walletconnect">{{ $t('open_modal') }}</button>
        </div>
        <wallet-connect-modal/>
    </div>
</template>

<script>
import WalletConnectModal from './WalletConnectModal'
import { mapActions } from 'vuex'

export default {
  name: 'wallet-connect-card',
  components: {
    WalletConnectModal
  },
  methods: {
    ...mapActions([
      'initSession'
    ]),
    openModal () {
      this.initSession()

      this.$modal.show('walletconnectModal')
    }
  }
}
</script>

<style lang="scss" scoped>
    .card {
        height: 100%;
        overflow: hidden;
    }

    .card-header, .card-footer {
        border: none;
        background: white;
    }

    .card-img {
        width: 50px;
        height: 50px;
        position: absolute;
        bottom: -5px;
        left: -5px;
    }
</style>

<i18n>
    {
        "en": {
            "card_text": "Scan a QR code to link your mobile wallet using <a href='https://metamask.io'>WalletConnect</a>.",
            "open_modal": "Use WalletConnect"
        },
        "ru": {
            "card_text": "Использовать <a href='https://metamask.io'>WalletConnect</a>.",
            "open_modal": "Использовать WalletConnect"
        }
    }
</i18n>
