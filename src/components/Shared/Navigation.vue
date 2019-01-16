<template>
      <nav class="navbar navbar-expand-md bg-white">
        <div class="container">
          <div class="navbar-brand">
            <logo/>
          </div>
          <div class="col-md-6">
            <div class="row justify-content-md-end justify-content- align-items-center">
              <metamask-account-switch-button v-if="accountAddress"/>
              <wallet-connect-account-switch-button v-if="accountAddress"/>
              <ledger-account-switch-list v-if="accountAddress"/>

              <refresh-button/>
              <settings-button/>
              <locale-changer v-if="!accountAddress"/>
              <logout-button/>
            </div>
          </div>
        </div>
      </nav>
</template>

<script>
import Logo from './Logo'
import MetamaskAccountSwitchButton from '../Providers/MetaMask/MetamaskAccountSwitchButton'
import WalletConnectAccountSwitchButton from '../Providers/WalletConnect/WalletConnectAccountSwitchButton'
import LedgerAccountSwitchList from '../Providers/Ledger/LedgerAccountSwitchList'
import CurrencyChanger from './CurrencyChanger'
import LocaleChanger from './LocaleChanger'
import LogoutButton from './LogoutButton'
import RefreshButton from './RefreshButton'
import SettingsButton from './SettingsButton'
import { mapState } from 'vuex'

export default {
  name: 'navigation',
  components: {
    Logo,
    MetamaskAccountSwitchButton,
    LedgerAccountSwitchList,
    WalletConnectAccountSwitchButton,
    CurrencyChanger,
    LocaleChanger,
    LogoutButton,
    RefreshButton,
    SettingsButton
  },
  computed: {
    ...mapState({
      accountAddress: state => state.account.address
    })
  }
}
</script>

<style scoped>
</style>
