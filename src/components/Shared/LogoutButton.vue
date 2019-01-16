<template>
    <button v-if="accountAddress" class="logout icon-wrapper" @click="logout">
        <log-out-icon/>
    </button>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ACCOUNT_RESET } from '../../store/modules/actions.type'
import { LogOutIcon } from 'vue-feather-icons'

export default {
  name: 'logout-button',
  components: {
    LogOutIcon
  },
  computed: {
    ...mapState({
      accountAddress: state => state.account.address
    })
  },
  methods: {
    ...mapActions([
      ACCOUNT_RESET,
      'resetState'
    ]),
    logout () {
      this[ACCOUNT_RESET]()
      this.resetState()
      this.$router.push({ name: 'index' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .logout {
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
            "logout": "Logout"

        },
        "ru": {
            "logout": "Выход"
        }
    }
</i18n>
