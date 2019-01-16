<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
    <modal height="auto" :adaptive="true" @before-open="beforeOpen" name="receiveModal">
        <div class="modal-content">
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title" id="exampleModalLabel">{{ $t('address_label') }}</h5>
                        <close-modal v-bind:modal-name="'receiveModal'"/>
                    </div>
                    <div class="modal-body text-center">
                        <qrcode-vue :value="'ethereum:'+accountAddress" :size="200" class="wrapper"></qrcode-vue>
                        <span class="wrapper"><b>{{ accountAddress }}</b></span>
                    </div>
                    <div class="modal-footer justify-content-between text-center">
                        <button type="button"
                                class="btn btn-primary"
                                v-clipboard:success="onCopy"
                                v-clipboard:copy="accountAddress">
                            {{ this.copied ? $t('clipboard_button_copied') : $t('clipboard_button')}}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import { mapState } from 'vuex'
import CloseModal from './CloseModal'

export default {
  name: 'receive-form',
  components: {
    QrcodeVue,
    CloseModal
  },
  data () {
    return {
      copied: false
    }
  },
  computed: {
    ...mapState({
      accountAddress: state => state.account.address
    })
  },
  methods: {
    onCopy () {
      this.copied = true
    },
    beforeOpen: function () {
      navigator.clipboard.readText()
        .then(text => {
          if (this.accountAddress === text) {
            this.copied = true
            return false
          }
        })

      this.copied = false
      return false
    }
  }
}
</script>

<style scoped>
    .wrapper {
        display: block;
        margin-top: 10px;
        margin-bottom: 10px;
    }

</style>

<i18n>
    {
        "en": {
            "address_label": "Your public address",
            "clipboard_button": "Copy address to clipboard",
            "clipboard_button_copied": "Copied"
        },
        "ru": {
            "address_label": "Ваш публичный адрес",
            "clipboard_button": "Скопировать адрес в буфер",
            "clipboard_button_copied": "Скопировано"
        }
    }
</i18n>
