<template>
    <div class="container">
        <div class="row mt-3 mb-3">
            <div class="col-sm">
                <h2>Access wallet</h2>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col-sm">
                <meta-mask-card/>
            </div>
            <div class="col-sm">
                <wallet-connect-card/>
            </div>
            <div class="col-sm">
                <ledger-card/>
            </div>
        </div>
        <div class="row mt-3 mb-3">
            <div class="col-sm">
                <h2>Check address</h2>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col-sm-4">
                <watch-address-card/>
            </div>
        </div>
        <div class="row mt-3 mb-3">
            <div class="col-sm">
                <h2>Create wallet</h2>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col-sm-4">
                <create-wallet-card/>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-sm">
                <shield-icon class="shield-icon"/>
                <h2>Trustless & Secure</h2>
                <p>We do not own your private keys and cannot access your funds.</p>
            </div>
        </div>
    </div>
</template>

<script>
import MetaMaskCard from '../Providers/MetaMask/MetaMaskCard'
import WatchAddressCard from '../Providers/WatchAddress/WatchAddressCard'
import LedgerCard from '../Providers/Ledger/LedgerCard'
import WalletConnectCard from '../Providers/WalletConnect/WalletConnectCard'
import { ShieldIcon } from 'vue-feather-icons'
import CreateWalletCard from '../Providers/CreateWallet/CreateWalletCard'

export default {
  name: 'index',
  components: {
    CreateWalletCard,
    MetaMaskCard,
    WatchAddressCard,
    LedgerCard,
    WalletConnectCard,
    ShieldIcon
  }
}
</script>

<style lang="scss" scoped>
    .shield-icon {
        stroke: $tokenary;
        margin: 10px;
        float: left;
    }
</style>
