<template>
    <div class="mt-5">
        <h4 class="title">{{ $t('tokens') }}</h4>

        <div class="card mb-4">
            <div class="card-body">

                <v-wait for='fetching tokens'>
                    <template slot='waiting'>
                        <spinner/>
                    </template>
                    <div v-if="this.tokens.length || this.ethereum">

                        <div>
                            <div class="list-group-item list-group-item-action borderless" :class="isCurrentAccount('ALL')">
                                <all-transactions-list-item/>
                            </div>
                            <hr class="gap">
                        </div>

                        <div>
                            <div class="list-group-item list-group-item-action borderless"
                                 :class="isCurrentAccount(ethereum.address)">
                                <wallet-item v-bind:wallet="ethereum"/>
                            </div>
                            <div v-if="show">
                                <hr class="gap">
                            </div>
                        </div>

                        <div v-for="(wallet, index) in orderedTokens"
                             v-show="wallet.price.USD.total > 5 || show"
                             :key="wallet.id">
                            <div class="list-group-item list-group-item-action borderless"
                                 :class="isCurrentAccount(wallet.address)">
                                <wallet-item v-bind:wallet="wallet"/>
                            </div>
                            <div v-if="index !== orderedTokens.length - 1">
                                <hr class="gap">
                            </div>
                        </div>
                    </div>

                </v-wait>
            </div>
        </div>
        <div class="text-center mt-2">
            <button v-if="countLowMarketTokens > 0"
                    v-on:click="show = !show"
                    class="btn btn-outline-primary btn-lg">
                {{ show ? $t('hide') : $t('show') }}
                {{ countLowMarketTokens }}
                {{ $t('button_show_low_market_token') }}
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import WalletItem from './WalletItem'
import AllTransactionsListItem from './AllTransactionsListItem'
import Spinner from './Shared/Spinner'

export default {
  components: {
    AllTransactionsListItem,
    WalletItem,
    Spinner
  },
  name: 'wallets-list',
  data () {
    return {
      show: false
    }
  },
  computed: {
    ...mapState([
      'selectedToken',
      'tokens',
      'ethereum'
    ]),
    ...mapGetters([
      'countLowMarketTokens',
      'orderedTokens'
    ])
  },
  methods: {
    isCurrentAccount (account) {
      return account === this.selectedToken ? 'selected' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
    .gap {
        margin-top: 1px;
    }

    .list-group-item {
        color: black;
        transition: background-color .1s ease;
        &:hover {
            transition: background-color .1s ease;
            background-color: $backgroundLightGrey;
            color:black;
        }
        &:active {
            transition: background-color .1s ease;
            background-color: darken($backgroundLightGrey, 5%);
        }
    }

    .selected {
        transition: background-color .1s ease;
        background-color: $backgroundLightBlue;

        &:hover {
            transition: background-color .1s ease;
            background-color: $backgroundLightBlue;
        }

        &:active {
            transition: background-color .1s ease;
            background-color: darken($backgroundLightBlue, 5%);
        }
    }

    .borderless {
        border: 0 none;
    }

    .hide-button {
        margin-top: 15px;
    }
</style>

<i18n>
    {
        "en": {
            "button_show_low_market_token": "tokens with low market value",
            "hide": "Hide",
            "show": "Show",
            "tokens": "Your tokens"
        },
        "ru": {
            "button_show_low_market_token": "токенов с низкой рыночной стоимостью",
            "hide": "Скрыть",
            "show": "Показать",
            "tokens": "Твои токены"
        }
    }
</i18n>
