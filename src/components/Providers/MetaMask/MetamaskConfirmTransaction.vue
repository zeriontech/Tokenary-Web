<template>
    <div>
        <div style="height: 100px">
            <spinner/>
        </div>
        {{ $t('confirm') }}
    </div>
</template>

<script>
import Spinner from '../../Shared/Spinner'

export default {
  name: 'metamask-confirm-transaction',
  components: {
    Spinner
  }
}
</script>

<style scoped>
</style>

<i18n>
    {
        "en": {
            "confirm": "Please confirmation transaction on MetaMask"
        },
        "ru": {
            "confirm": "Подтвердите транзакцию в MetaMask"
        }
    }
</i18n>
