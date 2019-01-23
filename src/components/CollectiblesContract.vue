<template>
    <div class="wrapper" v-on:click="selectContractCollectibles({address: contract.address})">
        <div class="img-wrapper">
            <img v-if="contract.image_url != null" :src="contract.image_url" class="logo" />
            <blockie v-else v-bind:data="contract.address" />
        </div>
        <div class="descr">
            <div class="name">
                <b class="token-name">{{contract.name}}</b>
            </div>
            <div class="balance">
                {{contract.symbol}}
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import mixins from '../mixins.js'
import Blockie from './Blockie'

export default {
  name: 'wallet-item',
  components: {
    Blockie
  },
  props: ['contract'],
  mixins: [mixins],
  computed: {
    ...mapState({
      accountCurrency: state => state.account.currency
    })
  },
  methods: {
    ...mapActions(['selectContractCollectibles'])
  }
}
</script>

<style lang="scss" scoped>
    .wrapper {
        display: flex;
        margin-bottom: 5px;
        margin-top: 5px;
        cursor: pointer;
    }

    .blockie {
        width: 50px;
        height: 50px;
    }

    .logo {
        max-width: 50px;
        max-height: 50px;
    }

    .descr {
        width: 100%;
    }

    .usd-val {
        float: right;
        color: $lightGrey;
    }

    .balance {
        font-size: 1.6rem;
        color: $darkGrey;
    }

    .token-name {
        color: black;
    }

    .img-wrapper {
        width: 50px;
        height: 50px;
        margin-right: 30px;
        cursor: pointer;
        object-fit: contain;
        background-color: white;
        border-radius: 300px;
    }
</style>
