<template>
    <div class="card">
        <img class="card-img" src="../../../assets/ledger-logo-mini.png" alt="Connect with your ledger device">
        <div class="card-body text-center">
            <h3 class="card-title">Ledger</h3>
            <p class="card-text" v-html="$t('card_text')"></p>
        </div>
        <div class="card-footer text-center">
            <button @click="openModal" type="button" class="btn btn-lg btn-ledger">{{ $t('open_modal') }}</button>
        </div>
        <ledger-modal/>
    </div>
</template>

<script>
import LedgerModal from './LedgerModal'

export default {
  name: 'ledger-card',
  components: {
    LedgerModal
  },
  methods: {
    openModal () {
      this.$modal.show('ledgerModal')
    }
  }
}
</script>

<style lang="scss" scoped>
  .card {
    height: 100%;
    overflow: hidden;
  }

  .card-footer {
    border: none;
    background: white;
  }
  .card-img {
    width: 50px;
    height: 50px;
    position: absolute;
    bottom:-5px;
    left:-5px;
  }
  .btn-ledger {
      background-color: $ledger;
      border-color: $ledger;
      color: white;
      &:hover {
          background-color: lighten($ledger, 5%);
          border-color: lighten($ledger, 5%);
          color: white;
      }
      &:active {
          background-color: white;
          color: $ledger;
          border-color: $ledger;
      }
  }
</style>

<i18n>
    {
        "en": {
            "card_text": "Connect and sign with your <a target='_blank' href='https://www.ledger.com/products/ledger-nano-s?r=9fcfa03d450e&tracker=web_tokenary'>Ledger</a> hardware wallet.",
            "open_modal": "Connect to Ledger"
        },
        "ru": {
            "card_text": "Использовать ваш <a target='_blank' href='https://www.ledger.com/products/ledger-nano-s?r=9fcfa03d450e&tracker=web_tokenary'>Ledger</a>.",
            "open_modal": "Подключиться"
        }
    }
</i18n>
