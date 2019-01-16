<template>
    <div class="card">
        <img class="card-img" src="../../../assets/metamask-logo.png" alt="Connect via MetaMask">
        <div class="card-body text-center">
            <h3 class="card-title">MetaMask</h3>
            <p class="card-text" v-html="$t('card_text')"></p>
        </div>
        <div class="card-footer text-center">
            <button @click="openModal" type="button" class="btn btn-metamask btn-lg">{{ $t('open_modal') }}</button>
        </div>
        <meta-mask-modal/>
    </div>
</template>

<script>
import MetaMaskModal from './MetaMaskModal'
import { mapActions } from 'vuex'

export default {
  name: 'meta-mask-card',
  components: {
    MetaMaskModal
  },
  methods: {
    ...mapActions([
      'getMetaMaskAccounts'
    ]),
    openModal () {
      this.getMetaMaskAccounts()

      this.$modal.show('metamaskModal')
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
            "card_text": "Connect to the <a href='https://metamask.io'>MetaMask</a> browser wallet.",
            "open_modal": "Connect to MetaMask"
        },
        "ru": {
            "card_text": "Использовать расширение <a href='https://metamask.io'>MetaMask</a>.",
            "open_modal": "Подключиться"
        }
    }
</i18n>
