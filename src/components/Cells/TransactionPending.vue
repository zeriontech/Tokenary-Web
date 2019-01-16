<template>
    <div class="pending">
        <clock-icon class="pending-icon" v-if="transaction.status === 'pending'"/>
        <check-icon class="mined-icon" v-if="transaction.status === 'mined'"/>
        <a target="_blank" class="ml-3" :href="'//etherscan.io/tx/'+transaction.hash">{{ transaction.hash }}</a>&nbsp;
    </div>
</template>

<script>
import ClockIcon from 'vue-feather-icons/icons/ClockIcon'
import CheckIcon from 'vue-feather-icons/icons/CheckIcon'
export default {
  name: 'transaction-pending',
  components: {
    ClockIcon,
    CheckIcon
  },
  props: ['transaction']
}
</script>

<style lang="scss" scoped>
    .pending-icon {
        stroke: $pending;
        width: 18px;
        height: 18px;
    }

    .mined-icon {
        stroke: $incoming;
        width: 18px;
        height: 18px;
    }
</style>
