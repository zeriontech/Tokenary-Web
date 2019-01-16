<template>
    <div>
        <v-wait for='fetching tokens'>
            <template slot='waiting'>
                <spinner/>
            </template>
            <strong>
                {{ $t('total') }}:
                {{ formattedTotal(total, accountCurrency.decimals_min, accountCurrency.decimals_max) }}
                {{ accountCurrency.symbol }}
            </strong>
        </v-wait>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import mixins from '../mixins.js'
import Spinner from './Shared/Spinner'

export default {
  name: 'total-value',
  mixins: [mixins],
  components: {
    Spinner
  },
  computed: {
    ...mapState([
      'total'
    ]),
    ...mapState({
      accountCurrency: state => state.account.currency
    })
  }
}
</script>

<i18n>
    {
        "en": {
            "total": "Total"
        },
        "ru": {
            "total": "Сумма"
        }
    }
</i18n>
