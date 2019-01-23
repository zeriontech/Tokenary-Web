<template>
    <div>
        <h4 class="title">{{ $t('tokens') }}</h4>

        <div class="mb-4">
            <div class="card-columns">
                <v-wait for='fetching tokens'>
                    <template slot='waiting'>
                        <spinner/>
                    </template>
                    <div v-if="this.filteredCollectibles.length">
                        <div v-for="(item) in filteredCollectibles"
                             :key="item.token_id">
                            <collectibles-item v-bind:collectible="item"/>
                        </div>
                    </div>
                </v-wait>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Spinner from './Shared/Spinner'
import CollectiblesItem from './CollectiblesItem'

export default {
  components: {
    Spinner,
    CollectiblesItem
  },
  name: 'collectibles-list',
  computed: {
    ...mapState([
      'collectibles'
    ]),
    ...mapGetters([
      'filteredCollectibles'
    ])
  }
}
</script>

<style lang="scss" scoped>
</style>

<i18n>
    {
        "en": {
            "tokens": "Your collectibles"
        },
        "ru": {
            "tokens": "Твои уникальные токены"
        }
    }
</i18n>
