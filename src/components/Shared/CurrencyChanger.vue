<template>
    <div v-if="accountAddress" class="form-group currency-changer">
        <div class="col-md-12">
            <label for="currency">{{$t('currency')}}</label>

            <select id="currency" name="currency" v-model="currencyName" class="form-control">
                <optgroup label="Favorite">
                    <option v-bind:value="rate.name" v-bind:key="i" v-for="(rate, i) in rates.favorite">
                        {{rate.name}} — {{rate.full_name}}
                    </option>
                </optgroup>

                <optgroup label="Other">
                    <option v-bind:value="rate.name" v-bind:key="i" v-for="(rate, i) in rates.all">
                        {{rate.name}} — {{rate.full_name}}
                    </option>
                </optgroup>
            </select>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ACCOUNT_UPDATE_CURRENCY } from '../../store/modules/actions.type'

export default {
  name: 'currency-changer',
  computed: {
    ...mapState([
      'rates'
    ]),
    ...mapState({
      accountAddress: state => state.account.address
    }),
    ...mapGetters([
      'getAccountCurrencyName'
    ]),
    currencyName: {
      get () {
        return this.getAccountCurrencyName
      },
      set (value) {
        let currency

        for (let i = 0; i < this.$store.state.rates.all.length; i++) {
          if (this.$store.state.rates.all[i].name === value) {
            currency = this.$store.state.rates.all[i]
            break
          }
        }

        for (let i = 0; i < this.$store.state.rates.favorite.length; i++) {
          if (this.$store.state.rates.favorite[i].name === value) {
            currency = this.$store.state.rates.favorite[i]
            break
          }
        }

        this[ACCOUNT_UPDATE_CURRENCY](currency)
      }
    }
  },
  methods: {
    ...mapActions([
      ACCOUNT_UPDATE_CURRENCY
    ])
  }
}
</script>

<style lang="scss" scoped>
    .currency-changer {
        margin-right: 10px;

        select {
            height: 30px !important;
        }
    }

    .form-control {
        font-size: 1.5rem;
    }

    label {
        margin-bottom: 0;
    }
</style>

<i18n>
    {
        "en": {
            "currency": "Currency"
        },
        "ru": {
            "currency": "Валюта"
        }
    }
</i18n>
