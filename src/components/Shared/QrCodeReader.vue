<template>
    <div>
        <qrcode-reader
                :paused="paused"
                @decode="onDecode"
                @init="onInit">
            <div v-show="paused" class="validation-layer">
                <div class="decode-result">
                    <u>Decoded</u>: {{ content }}
                </div>

                <div class="validation-notice">
                    <div v-if="validating">
                        Validation in progress...
                    </div>

                    <div v-else-if="isValid" class="text-success">
                        This is a address
                    </div>

                    <div v-else class="text-danger">
                        This is NOT a address!
                        <br>
                        <button @click="unPauseCamera">Retry</button>
                    </div>
                </div>
            </div>

            <div v-show="loading" class="loading-indicator">
                <spinner/>
            </div>
            <div v-show="error" class="loading-indicator">
                {{ error }}
            </div>
        </qrcode-reader>
    </div>
</template>

<script>
import Spinner from './Spinner'

export default {
  name: 'qr-code-reader',
  components: {
    Spinner
  },
  data () {
    return {
      isValid: false,
      validating: false,
      paused: false,
      content: null,
      loading: true,
      error: false
    }
  },
  methods: {
    async onDecode (content) {
      this.content = content
      this.pauseCamera()
      this.validating = true
      this.isValid = await this.validate(this.content)
      this.validating = false
    },
    pauseCamera () {
      this.paused = true
    },
    unPauseCamera () {
      this.paused = false
    },
    validate (content) {
      return new Promise(resolve => {
        const regexp = /(0x|0X)?[0-9a-f|0-9A-F]{40}$/
        const result = regexp.exec(content)
        if (result) {
          this.$emit('childToParent', result[0])
          resolve(true)
        } else {
          resolve(false)
        }
      })
    },
    async onInit (promise) {
      this.error = false
      this.loading = true

      try {
        await promise

        this.$emit('success')
        // successfully initialized
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = 'user denied camera access permisson'
        } else if (error.name === 'NotFoundError') {
          this.error = 'no suitable camera device installed'
        } else if (error.name === 'NotSupportedError') {
          this.error = 'page is not served over HTTPS (or localhost)'
        } else if (error.name === 'NotReadableError') {
          this.error = 'maybe camera is already in use'
        } else if (error.name === 'OverconstrainedError') {
          this.error = 'passed constraints don\'t match any camera.'
          // passed constraints don't match any camera.
          // Did you requested the front camera although there is none?
        } else {
          this.error = 'browser might be lacking features (WebRTC, ...)'
          // browser might be lacking features (WebRTC, ...)
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
    .validation-layer {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, .9);
        text-align: center;
        padding: 10px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
    }

    .validation-notice {
        font-weight: bold;
        font-size: 1.4rem;
    }

    .decode-result {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-style: italic;
    }
</style>

<i18n>
    {
        "en": {
            "address_label": "Paste the address (only view mode)",
            "search": "Search",
            "or": "or",
            "metamask_inject": "Please inject",
            "metamask_unlock": "Please unlock you metamask account",
            "metamask_button": "Use MetaMask account"
        },
        "ru": {
            "address_label": "Вставьте сюда адрес (только режим просмотра)",
            "search": "Поиск",
            "or": "или",
            "metamask_inject": "Установите расширение",
            "metamask_unlock": "Пожалуйста разблокируйте расширение",
            "metamask_button": "Использовать аккаунт MetaMask"
        }
    }
</i18n>
