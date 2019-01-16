<template>
    <div>
        <div class="float-left mr-3 ml-3">
            <blockie class="icon" v-bind:data="address.address"/>
        </div>
        <div class="text-left">
            <span class="d-block main-text">{{ address.address }}</span>
            <span class="sub-text">{{ address.balance }} ETH</span> &nbsp;<span class="sub-text">({{ formattedTotal(address.balanceUsd, 2, 2) }} {{ getAccountCurrencySymbol }})</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Blockie from './../Blockie'
import mixins from '../../mixins.js'

export default {
  components: {
    Blockie
  },
  name: 'short-account-info',
  props: ['address'],
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'getAccountCurrencyName',
      'getAccountCurrencySymbol'
    ])
  }
}
</script>

<style lang="scss" scoped>
    .icon {
        width: 50px;
        height: 50px;
    }

    .main-text {
        color: $black;
    }

    .sub-text {
        color: $darkGrey;
    }
</style>
