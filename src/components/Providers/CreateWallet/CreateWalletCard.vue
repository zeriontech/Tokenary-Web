<template>
    <div class="card">
        <img class="card-img" src="../../../assets/logo.png" alt="Tokenary Wallet">
        <div class="card-body text-center">
            <h3 class="card-title">Tokenary wallet</h3>
            <p class="card-text">
                {{ $t('card_text') }}
            </p>
        </div>
        <div class="card-footer text-center">
            <button @click="openModal" type="button" class="btn btn-tokenary btn-lg">
                {{ $t('open_modal') }}
            </button>
        </div>
        <create-wallet-modal/>
    </div>
</template>

<script>
import CreateWalletModal from './CreateWalletModal'

export default {
  name: 'create-wallet-card',
  components: {
    CreateWalletModal
  },
  methods: {
    openModal () {
      this.$modal.show('createWalletModal')
    }
  }
}
</script>

<style scoped>
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
    bottom:-5px;
    left:-10px;
  }
</style>

<i18n>
    {
        "en": {
            "card_text": "Obtain an ETH address and generate your private key. Saving and safekeeping the key will be your responsibility.",
            "open_modal": "Get started"
        },
        "ru": {
            "card_text": "Создать кошелек",
            "open_modal": "Начать"
        }
    }
</i18n>
