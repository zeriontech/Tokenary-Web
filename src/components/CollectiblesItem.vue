<template>
    <div class="card" style="width: 20rem;">
        <img :style="{ backgroundColor: '#'+collectible.background_color }"
             class="card-img-top" :src="collectible.image_preview_url" alt="Card image cap">
        <div class="card-body text-center">
            <h5 class="card-title">{{collectible.name}} ({{ collectible.token_id }})</h5>
            <a target="_blank" :href="collectible.permalink" class="btn btn-block btn-info btn-lg">Go somewhere</a>
            <button :disabled="!couldExecuteTransaction" @click="gift()" class="btn btn-block btn-tokenary btn-lg">Send a gift</button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import mixins from '../mixins.js'
import Blockie from './Blockie'
import SendCollectibleForm from './SendTransactionForm/SendCollectibleForm'

export default {
  name: 'collectibles-item',
  components: {
    Blockie,
    SendCollectibleForm
  },
  props: ['collectible'],
  mixins: [mixins],
  computed: {
    ...mapState({
      blockChainStats: state => state.blockChainStats
    }),
    ...mapGetters([
      'getNftVersionByToken',
      'couldExecuteTransaction'
    ])
  },
  methods: {
    gift () {
      this.$modal.show(SendCollectibleForm, {
        collectible: this.collectible,
        gasStart: this.fromWei(this.blockChainStats.fast, 'gwei'),
        nftVersion: this.getNftVersionByToken(this.collectible.contract)
      },
      {
        adaptive: true,
        height: 'auto'
      })
      this.$store.dispatch('updateCurrentTransactionHash', { hash: null })
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
