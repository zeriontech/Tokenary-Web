<template>
    <div class="mt-5">
        <h4 class="title">{{ $t('tokens') }}</h4>

        <div class="card mb-4">
            <div class="card-body">

                <v-wait for='fetching tokens'>
                    <template slot='waiting'>
                        <spinner/>
                    </template>
                    <div v-if="contractCollectibles.length">
                        <div>
                            <div class="list-group-item list-group-item-action borderless"
                                 :class="isCurrentAccount('ALL')">
                                <div class="wrapper" v-on:click="selectContractCollectibles({address: 'ALL'})">
                                    <img :src="require('../assets/transactions.svg')" class="icon">
                                    <b>{{ $t('all_contracts') }}</b>
                                </div>
                            </div>
                            <hr class="gap">
                        </div>

                        <div v-for="(contract, index) in contractCollectibles"
                             :key="contract.id">
                            <div class="list-group-item list-group-item-action borderless"
                                 :class="isCurrentAccount(contract.address)">
                                <collectibles-contract v-bind:contract="contract"/>
                            </div>
                            <div v-if="index !== contractCollectibles.length - 1">
                                <hr class="gap">
                            </div>
                        </div>
                    </div>

                </v-wait>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import WalletItem from './WalletItem'
import AllTransactionsListItem from './AllTransactionsListItem'
import CollectiblesContract from './CollectiblesContract'
import Spinner from './Shared/Spinner'

export default {
  components: {
    AllTransactionsListItem,
    WalletItem,
    Spinner,
    CollectiblesContract
  },
  name: 'collectibles-contracts-list',
  computed: {
    ...mapState([
      'selectedContractCollectibles',
      'contractCollectibles'
    ])
  },
  methods: {
    ...mapActions(['selectContractCollectibles']),
    isCurrentAccount (account) {
      return account === this.selectedContractCollectibles ? 'selected' : ''
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
            color: black;
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
            "all_contracts": "All collectibles",
            "tokens": "Your unique tokens"
        },
        "ru": {
            "all_contracts": "Все уникальные",
            "tokens": "Твои токены"
        }
    }
</i18n>
