<template>
    <button :disabled="!hasBuy" class="btn btn-success btn-lg"
            @click="$modal.show('buyForm')">
        {{ $t('buy') }}
    </button>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'buy-button',
  computed: {
    ...mapGetters([
      'hasBuy'
    ])
  }
}
</script>

<style scoped>
    .btn {
        width: 100%;
    }
</style>
<i18n>
    {
        "en": {
            "buy": "Buy"
        },
        "ru": {
            "buy": "Купить"
        }
    }
</i18n>
