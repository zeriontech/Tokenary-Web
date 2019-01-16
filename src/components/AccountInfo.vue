<template>
    <div class="account-info">
        <h4 class="title">{{ $t('account') }}</h4>
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-sm-1 mr-5">
                        <div class="account-img circle">
                            <blockie class="icon" v-bind:data="accountAddress"/>
                        </div>
                    </div>
                    <div class="col-sm-10">
                        <a class="account-address" target="_blank"
                           v-bind:href="'https://etherscan.io/address/'+accountAddress">{{ accountAddress }}</a>
                        <total-value/>
                    </div>
                </div>
                <div class="row mt-3 justify-content-between">
                    <div class="col-sm">
                        <send-button/>
                    </div>
                    <div class="col-sm">
                        <receive-button/>
                    </div>
                    <div class="col-sm">
                        <buy-button/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import TotalValue from './TotalValue'
import SendButton from './Shared/SendButton'
import ReceiveButton from './Shared/ReceiveButton'
import BuyButton from './Shared/BuyButton'
import Blockie from './Blockie'

export default {
  components: {
    TotalValue,
    SendButton,
    ReceiveButton,
    Blockie,
    BuyButton
  },
  name: 'account-info',
  computed: {
    ...mapState({
      accountAddress: state => state.account.address
    })
  }
}
</script>

<style lang="scss" scoped>
    .account-img {
        img {
            max-width: none;
            max-height: none;
            width:50px;
            height: 50px;
        }
    }
    .account-address {
        font-size: 1.4rem;
    }
</style>

<i18n>
    {
        "en": {
            "button_show_low_market_token": "tokens with low market value",
            "hide": "Hide",
            "show": "Show",
            "account": "Account"
        },
        "ru": {
            "button_show_low_market_token": "токенов с низкой рыночной стоимостью",
            "hide": "Скрыть",
            "show": "Показать",
            "account": "Кошелек"
        }
    }
</i18n>
