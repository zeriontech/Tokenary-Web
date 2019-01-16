<template>
    <div class="card">
        <img class="card-img" src="../../../assets/ethereum.svg" alt="Watch Address">
        <div class="card-body text-center">
            <h3 class="card-title">Ethereum address</h3>
            <p class="card-text">
                {{ $t('card_text') }}
            </p>
        </div>
        <div class="card-footer text-center">
            <button @click="openModal" type="button" class="btn btn-tokenary btn-lg">
                {{ $t('open_modal') }}
            </button>
        </div>
        <watch-address-modal/>
    </div>
</template>

<script>
import WatchAddressModal from './WatchAddressModal'

export default {
  name: 'watch-address-card',
  components: {
    WatchAddressModal
  },
  methods: {
    openModal () {
      this.$modal.show('watchAddressModal')
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
            "card_text": "View an address in a read only state",
            "open_modal": "Check address"
        },
        "ru": {
            "card_text": "Смотреть адрес в режиме только для чтения",
            "open_modal": "Проверить адрес"
        }
    }
</i18n>
