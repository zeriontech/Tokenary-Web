<template>
    <div class="card" style="width: 18rem;">
        <img :style="{ backgroundColor: '#'+collectible.background_color }"
             class="card-img-top" :src="collectible.image_preview_url" alt="Card image cap">
        <div class="card-body text-center">
            <h5 class="card-title">{{collectible.name}} ({{ collectible.token_id }})</h5>
            <a target="_blank" :href="collectible.permalink" class="btn btn-primary">Go somewhere</a>
            <!--<a @click="gift()">Gift</a>-->
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import mixins from '../mixins.js'
import Blockie from './Blockie'

export default {
  name: 'collectibles-item',
  components: {
    Blockie
  },
  props: ['collectible'],
  mixins: [mixins],
  computed: {
    ...mapState({
      blockChainStats: state => state.blockChainStats,
      accountAddress: state => state.account.address
    })
  },
  methods: {
    ...mapActions(['sendTransaction']),
    gift () {
      this.sendTransaction(
        {
          from: this.accountAddress,
          to: '0x0aD9Fb61a07BAC25625382B63693644497f1B204',
          gasPrice: this.blockChainStats.fast,
          value: this.collectible.token_id,
          contractAddress: this.collectible.contract,
          decimals: 0,
          gasLimit: 54379
        }
      ).then(() => {
      })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
    .card-img-top {
        border-top-left-radius: calc(1rem);
        border-top-right-radius: calc(1rem);
    }
</style>
