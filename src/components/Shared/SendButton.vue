<template>
    <button :disabled="!couldExecuteTransaction" class="btn btn-tokenary btn-lg"
            @click="$modal.show('sendModal')">
        <send-icon class="btn-icon"/>
        {{ $t('send') }}
    </button>
</template>

<script>
import { mapGetters } from 'vuex'
import { SendIcon } from 'vue-feather-icons'

export default {
  name: 'send-button',
  components: {
    SendIcon
  },
  computed: {
    ...mapGetters([
      'couldExecuteTransaction'
    ])
  }
}
</script>

<style scoped>
  .btn {
    width: 100%;
  }

    .btn-icon {
        width:18px;
        height: 18px;
        float:left;
    }
</style>
<i18n>
    {
        "en": {
            "send": "Send"
        },
        "ru": {
            "send": "Отправить"
        }
    }
</i18n>
