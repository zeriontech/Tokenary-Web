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
  name: 'ledger-confirm-transaction',
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
            "confirm": "Please confirmation transaction on you device"
        },
        "ru": {
            "confirm": "Подтвердите транзакцию на вашем Ledger"
        }
    }
</i18n>
