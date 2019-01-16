<template>
    <modal height="auto" :adaptive="true" @before-open="beforeOpenLedger" name="ledgerModal">
        <div class="modal-content">
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title" id="exampleModalLabel">Connect Ledger</h5>
                        <close-modal v-bind:modal-name="'ledgerModal'"/>
                    </div>
                    <div class="modal-body text-center">
                        Make sure your Ledger is unlocked, you've selected the ETH app on the device, and browser
                        support is enabled.
                        <v-wait for='fetching ledger accounts'>
                            <template slot='waiting'>
                                <spinner/>
                            </template>
                            <div class="form-group">
                                <div v-bind:key="key" v-for="(item, key) in addresses"
                                     v-if="typeof addresses !== 'undefined' && addresses.length > 0"
                                     class="inputGroup">
                                    <input v-bind:id="key + '1'" name="radio" v-bind:value="item.address"
                                           v-model="address" type="radio"/>
                                    <label v-bind:for="key + '1'">
                                        <short-account-info v-bind:address="item"/>
                                    </label>
                                </div>
                            </div>
                            <div v-if="typeof addresses !== 'undefined' && addresses.length > 0">
                                <button class="btn btn-orange"
                                        :disabled="offset === 0"
                                        @click="getPreviusLedgerAddresses">
                                    back
                                </button>
                                <button class="btn btn-orange"
                                        @click="getNextLedgerAddresses">
                                    next
                                </button>
                            </div>
                        </v-wait>
                    </div>
                    <div class="modal-footer justify-content-between text-center">
                        <button :disabled="!address" class="btn btn-orange"
                                @click="useLedger">
                            use ledger
                        </button>

                        <button
                                :disabled="$wait.is('fetching ledger accounts')"
                                class="btn btn-orange"
                                @click="beforeOpenLedger">
                            <span v-if="$wait.is('fetching ledger accounts')">loading</span>
                            update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ACCOUNT_UPDATE_ADDRESS } from '../../../store/modules/actions.type'
import CloseModal from '../../CloseModal'
import Blockie from '../../Blockie'
import { getBalanceEth } from '../../../api'
import Spinner from '../../Shared/Spinner'
import ShortAccountInfo from '../ShortAccountInfo'

export default {
  name: 'ledger-modal',
  components: {
    ShortAccountInfo,
    Spinner,
    CloseModal,
    Blockie
  },
  data () {
    return {
      address: '',
      addresses: [],
      offset: 0
    }
  },
  computed: {
    ...mapState({
      providerAddresses: state => state.ledger.ledgerProviderAddresses
    })
  },
  methods: {
    ...mapActions([
      ACCOUNT_UPDATE_ADDRESS,
      'getLedgerAccounts',
      'pushAccountLedgerProviderAddress',
      'updateAccountLedgerProviderAddressesEth',
      'addLedgerRecentAddresses'
    ]),
    useLedger () {
      this[ACCOUNT_UPDATE_ADDRESS]({
        address: this.address,
        type: 'LEDGER'
      })
      this.addLedgerRecentAddresses(this.address)
      this.$modal.hide('ledgerModal')
      this.$router.replace({ name: 'dashboard', params: { address: this.address } })
    },
    async getLedgerAddresses () {
      if (this.providerAddresses.slice(this.offset, this.offset + 5).length > 0) {
        this.addresses = this.providerAddresses.slice(this.offset, this.offset + 5)
      } else {
        this.addresses = await this.getLedgerAccounts(this.offset)

        if (typeof this.addresses !== 'undefined' && this.addresses.length) {
          this.$wait.start('fetch balance')
          this.pushAccountLedgerProviderAddress(this.providerAddresses.concat(this.addresses))
          getBalanceEth(this.addresses.map((item) => {
            return item.address
          }), 'USD').then(res => {
            if (res && this.$children[0].visible) {
              this.updateAccountLedgerProviderAddressesEth(res.data)
            }
            this.$wait.end('fetch balance')
          }).catch(e => {
            this.$wait.end('fetch balance')
          })
        }
      }
    },
    async getPreviusLedgerAddresses () {
      this.offset -= 5
      this.getLedgerAddresses()
    },
    async getNextLedgerAddresses () {
      this.offset += 5
      this.getLedgerAddresses()
    },
    async beforeOpenLedger () {
      this.offset = 0
      this.pushAccountLedgerProviderAddress([])
      this.getLedgerAddresses()
    }
  }
}
</script>

<style lang="scss" scoped>
    .btn-orange {
        background-color: $orange;
        border-color: $orange;
        color: white;

        &:hover {
            background-color: darken($orange, 5%);
            border-color: darken($orange, 5%);
        }
    }

    .inputGroup {
        background-color: #fff;
        display: block;
        margin: 10px 0;
        position: relative;

        label {
            padding: 12px 0px;
            width: 100%;
            display: block;
            text-align: left;
            color: #3C454C;
            cursor: pointer;
            position: relative;
            z-index: 2;
            transition: color 200ms ease-in;
            overflow: hidden;

            &:before {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                content: '';
                background-color: #5562eb;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%) scale3d(1, 1, 1);
                transition: all 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
                opacity: 0;
                z-index: -1;
            }

            &:after {
                width: 32px;
                height: 32px;
                content: '';
                border: 2px solid #D1D7DC;
                background-color: #fff;
                background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.414 11L4 12.414l5.414 5.414L20.828 6.414 19.414 5l-10 10z' fill='%23fff' fill-rule='nonzero'/%3E%3C/svg%3E ");
                background-repeat: no-repeat;
                background-position: 2px 3px;
                border-radius: 50%;
                z-index: 2;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                transition: all 200ms ease-in;
            }
        }

        input:checked ~ label {
            color: #fff;

            &:before {
                transform: translate(-50%, -50%) scale3d(56, 56, 1);
                opacity: 1;
            }

            &:after {
                background-color: #54E0C7;
                border-color: #54E0C7;
            }
        }

        input {
            width: 32px;
            height: 32px;
            order: 1;
            z-index: 2;
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            visibility: hidden;
        }
    }
</style>

<i18n>
    {
        "en": {
            "metamask_inject": "Please inject",
            "metamask_unlock": "Please unlock you metamask account",
            "metamask_network": "Please change to main network.",
            "metamask_button": "Use MetaMask account"
        },
        "ru": {
            "metamask_inject": "Установите расширение",
            "metamask_unlock": "Пожалуйста разблокируйте расширение",
            "metamask_network": "Пожалуйста используйте основную сеть",
            "metamask_button": "Использовать аккаунт MetaMask"
        }
    }
</i18n>
