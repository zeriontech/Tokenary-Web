<template>
    <button v-if="accountAddress" class="refresh icon-wrapper" @click="refresh">
            <spinner v-if="$wait.is('fetching transactions')" />
            <refresh-ccw-icon class="icon-wrapper" v-else/>
    </button>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import RefreshCcwIcon from 'vue-feather-icons/icons/RefreshCcwIcon'
import Spinner from './Spinner'

export default {
  name: 'refresh-button',
  components: {
    Spinner,
    RefreshCcwIcon
  },
  computed: {
    ...mapState({
      accountAddress: state => state.account.address
    })
  },
  methods: {
    ...mapActions([
      'refreshTransactions',
      'fetchTokens'
    ]),
    refresh () {
      this.fetchTokens()
      this.refreshTransactions()
    }
  },
  created () {
    const wakeEvent = require('wake-event')
    wakeEvent(() => {
      if (this.accountAddress !== '') {
        this.fetchTokens()
        this.refreshTransactions()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
    .refresh {
        width: 20px;
        height: 20px;
        padding: 0;
        cursor: pointer;
        border: none;
        outline: none;
        margin-left: 20px;
        svg {
            width: 100%;
        }
    }
</style>

<i18n>
    {
        "en": {
            "refresh": "Refresh"
        },
        "ru": {
            "refresh": "Обновить"
        }
    }
</i18n>
