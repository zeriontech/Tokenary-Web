<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
    <modal v-if="hasBuy" height="auto" :adaptive="true" @opened="opened" name="buyForm">
        <div class="modal-content">
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title" id="exampleModalLabel">{{ $t('buy_tokens') }}</h5>
                        <close-modal v-bind:modal-name="'buyForm'"/>
                    </div>
                    <div id="iframe-wrapper" class="text-center iframe-wrapper">
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import CloseModal from './CloseModal'
import { mapGetters, mapState } from 'vuex'
import {
  ledgerEthereumBrowserClientFactoryAsync as ledgerEthereumClientFactoryAsync,
  LedgerSubprovider,
  RPCSubprovider,
  Web3ProviderEngine
} from '@0x/subproviders'
import WalletConnectSubprovider from 'walletconnect-web3-subprovider'

export default {
  name: 'buy-form',
  components: {
    CloseModal
  },
  data () {
    return {
      html: 'qwe'
    }
  },
  computed: {
    ...mapState({
      accountType: state => state.account.type
    }),
    ...mapGetters([
      'hasBuy'
    ])
  },
  methods: {
    opened: function () {
      let wrapper = this.$el.getElementsByClassName('iframe-wrapper')[0]
      let iframe = document.createElement('iframe')
      iframe.classList.add('iframe0x')
      wrapper.appendChild(iframe)

      let provider = null
      let walletDisplayName = 'MetaMask'
      const providerEngine = new Web3ProviderEngine()

      switch (this.accountType) {
        case 'LEDGER':
          walletDisplayName = 'Ledger'
          const ledgerSubprovider = new LedgerSubprovider({
            networkId: 1,
            ledgerEthereumClientFactoryAsync
          })
          providerEngine.addProvider(ledgerSubprovider)
          providerEngine.addProvider(
            new RPCSubprovider(process.env.VUE_APP_TOKENARY_URL_PROVIDER)
          )
          providerEngine.start()
          break
        case 'WALLETCONNECT':
          walletDisplayName = 'WalletConnect'

          const walletConnectSubprovider = new WalletConnectSubprovider({
            bridgeUrl: process.env.VUE_APP_WALLETCOONNECT_BRIDGE_URL,
            dappName: process.env.VUE_APP_WALLETCOONNECT_DAPP_NAME
          })
          providerEngine.addProvider(walletConnectSubprovider)
          providerEngine.addProvider(
            new RPCSubprovider(process.env.VUE_APP_TOKENARY_URL_PROVIDER)
          )
          providerEngine.start()
          providerEngine.walletconnect.initSession()
          break
        default:
          provider = window.ethereum || window.web3.currentProvider
          break
      }

      window.orderSource = process.env.VUE_APP_0X_ORDER_SOURCE_URL
      window.provider = provider || providerEngine
      window.walletDisplayName = walletDisplayName

      iframe.contentDocument.open()
      iframe.contentDocument.write(`
      \<script src="https://instant.0xproject.com/instant.js">\<\/script>
      \<script>
        const intervalId = setInterval(
          () => {
            if (window.zeroExInstant) {
              clearInterval(intervalId);
              window.zeroExInstant.render({
                orderSource: parent.orderSource,
                provider: parent.provider,
                walletDisplayName: parent.walletDisplayName
              }, 'body');
            }
          },
          300,
        );
      \<\/script>
    `)
      iframe.contentDocument.close()
    }
  }
}
</script>

<style lang="scss">
    .iframe-wrapper {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        position: relative;
    }

    .iframe-wrapper iframe {
        position: absolute;
        border: 0;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%
    }
</style>

<i18n>
    {
        "en": {
            "buy_tokens": "Buy tokens"
        },
        "ru": {
            "buy_tokens": "Купить токены"
        }
    }
</i18n>
