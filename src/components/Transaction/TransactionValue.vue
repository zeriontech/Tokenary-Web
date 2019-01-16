<template>
    <div class="tx-value">
        <div v-if="value != null" v-bind:class="textStyle">
            {{sign}}{{value}} {{tokenSymbol}}
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'transaction-value',
  props: ['value', 'tokenSymbol', 'currency', 'sign', 'hasSucceed'],
  computed: {
    ...mapState({
      accountCurrency: state => state.account.currency
    }),
    textStyle: function () {
      if (!this.hasSucceed) {
        return 'fail'
      } else if (this.sign === '+') {
        return 'income'
      } else {
        return 'outcome'
      }
    }
  }
}
</script>

<style scoped>
    div {
        display: inline-block;
    }

    .income {
        color: #56B268;
    }

    .fail {
        color: #FB2D55;
    }

    .tx-value {
        font-size: 1.8rem;
    }

</style>

<i18n>
    {
        "en": {
            "value": "Value"
        },
        "ru": {
            "value": "Сумма"
        }
    }
</i18n>
