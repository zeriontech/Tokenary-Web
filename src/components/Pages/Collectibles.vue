<template>
    <div>
        <menu-left/>
        <div class="container">
            <div class="mt-1 row justify-content-center">
                <div class="col-md-5">
                    <account-info/>
                    <collectibles-contracts-list/>
                </div>
                <div class="col-md-7">
                    <collectibles-list/>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import MenuLeft from '../Shared/Menu'
import CollectiblesList from '../CollectiblesList'
import CollectiblesContractsList from '../CollectiblesContractsList'
import AccountInfo from '../AccountInfo'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'collectibles',
  components: {
    AccountInfo,
    CollectiblesList,
    MenuLeft,
    CollectiblesContractsList
  },
  methods: {
    ...mapActions([
      'metamaskCheck',
      'fetchRates'
    ])
  },
  computed: {
    ...mapState({
      accountAddress: state => state.account.address
    })
  },
  created: function () {
    this.metamaskCheck()
    this.fetchRates()
  }
}
</script>

<style lang="scss" scoped>
</style>
