<template>
  <div class="wrapper" v-on:click="seeAll()">
    <img :src="require('../assets/transactions.svg')" class="icon">
    <b>{{ $t('all_transactions') }}</b>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'all-transactions-list-item',
  methods: {
    ...mapActions(['seeAll'])
  }
}
</script>

<style lang="scss" scoped>
  .wrapper {
    margin-bottom: 5px;
    margin-top: 5px;
    cursor: pointer;
  }

  .icon {
    max-width: 50px;
    max-height: 50px;
    object-fit: contain;
    border-radius: 50%;
    margin-right: 30px;
    cursor: pointer;
    border: 1px solid lighten($lightGrey, 30%);
    box-sizing: border-box;
  }
</style>

<i18n>
  {
    "en": {
      "all_transactions": "All transactions"
    },
    "ru": {
      "all_transactions": "Все транзакции"
    }
  }
</i18n>
