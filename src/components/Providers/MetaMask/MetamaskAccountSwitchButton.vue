<template>
    <div>
        <button v-if="
    accountType !== 'LEDGER' &&
    accountType !== 'WATCH' &&
    ((providerAddress !== accountAddress) ||
    (accountType === 'WATCH')) &&
    metamaskInject &&
    metamaskUserAccess &&
    accountAddress !== ''"
                class="btn btn-metamask-inverse"
                @click="switchAccount">
            <img class="btn-image-inner" src="../../../assets/metamask-logo.png" alt="Connect via MetaMask">
            {{ $t('metamask_another_account') }}
        </button>

        <button v-if="
        accountType === 'WATCH' && metamaskInject"
                class="btn btn-metamask-inverse"
                @click="connect">
            <img class="btn-image-inner" src="../../../assets/metamask-logo.png" alt="Connect via MetaMask">
            {{$t('metamask_connect')}}
        </button>
        <meta-mask-modal/>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ACCOUNT_UPDATE_ADDRESS } from '../../../store/modules/actions.type'
import MetaMaskModal from './MetaMaskModal'

export default {
  name: 'metamask-account-switch-button',
  components: {
    MetaMaskModal
  },
  computed: {
    ...mapState({
      accountAddress: state => state.account.address,
      providerAddress: state => state.metaMask.address ? state.metaMask.address.address : '',
      accountType: state => state.account.type,

      metamaskInject: state => state.metaMask.inject,
      metamaskUserAccess: state => state.metaMask.userAccess
    })
  },
  methods: {
    ...mapActions([
      ACCOUNT_UPDATE_ADDRESS,
      'getMetaMaskAccounts'
    ]),
    switchAccount () {
      this.$router.replace({ name: 'dashboard', params: { address: this.providerAddress } })

      this[ACCOUNT_UPDATE_ADDRESS]({
        address: this.providerAddress,
        type: 'METAMASK'
      })
    },
    connect () {
      this.getMetaMaskAccounts()

      this.$modal.show('metamaskModal')
    }
  }
}
</script>

<style lang="scss" scoped>
    label {
        margin-bottom: 0;
    }

    .btn-metamask-inverse {
        background-color: white;
        border-color: $metamask;
        color: $black;
        font-size: 1.5rem;
        &:hover {
            background-color: $metamask;
            border-color: $metamask;
            color: white;
        }
        &:active {
            background-color: darken($metamask, 5%);
            border-color: darken($metamask, 5%);
            color:white;
            box-shadow: 0 0 11px rgba(33,33,33,.2);
        }
    }

    .btn-image-inner {
        width: 15px;
        height: 15px;
        margin: 4px;
    }
</style>

<i18n>
    {
        "en": {
            "metamask_another_account": "Switch MetaMask account",
            "metamask_connect": "Connect MetaMask"
        },
        "ru": {
            "metamask_another_account": "Обновить аккаунт MetaMask",
            "metamask_connect": "Подключить MetaMask"
        }
    }
</i18n>
