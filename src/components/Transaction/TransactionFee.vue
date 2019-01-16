<template>
    <div class="col-md-12">
        <div v-if="ethFee != null">
            {{ $t('fee') }}:
            {{ethFee}} ETH
        </div>
        <div v-if="fee != null">
            &nbsp;≈ {{fee}} {{accountCurrency.symbol}}
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'transaction-fee',
  props: ['ethFee', 'fee'],
  computed: {
    ...mapState({
      accountCurrency: state => state.account.currency
    })
  }
}
</script>

<style scoped>
    div {
        display: inline-block;
    }
</style>

<i18n>
    {
        "en": {
            "fee": "Fee"
        },
        "ru": {
            "fee": "Комиссия"
        }
    }
</i18n>
