<template>
    <button v-if="accountAddress" class="btn btn-tokenary btn-lg"
            @click="$modal.show('receiveModal')">
        <qr-icon class="btn-icon"/>
        {{ $t('receive') }}
    </button>
</template>

<script>
import { mapState } from 'vuex'
import QrIcon from './QrIcon'

export default {
  name: 'receive-button',
  components: { QrIcon },
  computed: {
    ...mapState({
      accountAddress: state => state.account.address
    })
  }
}
</script>

<style lang="scss" scoped>
  .btn {
    width: 100%;
  }
  .btn-icon {
      width:18px;
      height: 18px;
      float:left;
      fill:white;
  }

    .btn-tokenary {
        &:active {
            .btn-icon {
                fill: $tokenary;
            }
        }
    }
</style>
<i18n>
    {
        "en": {
            "receive": "Receive"
        },
        "ru": {
            "receive": "Получить"
        }
    }
</i18n>
