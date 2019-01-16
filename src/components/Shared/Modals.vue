<template>
    <div>
        <send-transaction-form/>
        <receive-form/>
        <settings-form/>
        <buy-form/>
    </div>
</template>

<script>
import SendTransactionForm from '../SendTransactionForm/SendTransactionForm'
import ReceiveForm from '../ReceiveForm'
import SettingsForm from '../SettingsForm'
import BuyForm from '../BuyForm'

export default {
  name: 'Modals',
  components: {
    SendTransactionForm,
    ReceiveForm,
    SettingsForm,
    BuyForm
  }
}
</script>

<style scoped>
</style>
