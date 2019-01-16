<template>
    <div v-if="accountType === 'LEDGER'">
        <select class="form-control" v-model="currentAccount">
            <optgroup label="Recent">
                <option v-for="(account, i) in recentProviderAddresses" v-bind:key="i" v-bind:value="account">
                    {{ account }}
                </option>
            </optgroup>
            <optgroup label="All">
                <option v-for="(account, i) in providerAddresses" v-bind:key="i" v-bind:value="account.address">
                    {{ account.address }}
                </option>
            </optgroup>
            <option v-bind:value="'other'">Other</option>
        </select>
        <ledger-modal/>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ACCOUNT_UPDATE_ADDRESS } from '../../../store/modules/actions.type'
import popover from 'vue-popover'
import LedgerModal from './LedgerModal'

export default {
  name: 'ledger-account-switch-list',
  components: {
    popover,
    LedgerModal
  },
  computed: {
    ...mapState({
      accountAddress: state => state.account.address,
      accountType: state => state.account.type,
      recentProviderAddresses: state => state.ledger.ledgerRecentAddresses,
      providerAddresses: state => state.ledger.ledgerProviderAddresses
    }),
    currentAccount: {
      get () {
        if (this.recentProviderAddresses) {
          return this.recentProviderAddresses.filter(
            account => this.accountAddress.toLowerCase() === account.toLowerCase()
          )[0]
        }
        return ''
      },
      set (value) {
        if (value === 'other') {
          this.$modal.show('ledgerModal')
        } else {
          this.$router.replace({ name: 'dashboard', params: { address: value } })
          this.addLedgerRecentAddresses(value)
          this[ACCOUNT_UPDATE_ADDRESS]({
            address: value,
            type: 'LEDGER'
          })
        }
      }
    }
  },
  methods: {
    ...mapActions([
      ACCOUNT_UPDATE_ADDRESS,
      'addLedgerRecentAddresses'
    ])
  }
}
</script>
