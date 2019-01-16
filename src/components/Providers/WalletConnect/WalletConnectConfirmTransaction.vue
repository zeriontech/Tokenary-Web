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
  name: 'wallet-connect-confirm-transaction',
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
            "confirm": "Please confirmation transaction on WalletConnect"
        },
        "ru": {
            "confirm": "Подтвердите транзакцию в WalletConnect"
        }
    }
</i18n>
