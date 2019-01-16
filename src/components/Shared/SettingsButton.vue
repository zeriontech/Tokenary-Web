<template>
    <button v-if="accountAddress" @click="$modal.show('settingsModal')" class="settings icon-wrapper">
        <settings-icon/>
    </button>
</template>

<script>
import { mapState } from 'vuex'
import SettingsIcon from 'vue-feather-icons/icons/SettingsIcon'

export default {
  components: {
    SettingsIcon
  },
  name: 'settings-button',
  computed: {
    ...mapState({
      accountAddress: state => state.account.address
    })
  }
}
</script>

<style lang="scss" scoped>
    .settings {
        width: 20px;
        height: 20px;
        padding: 0;
        cursor: pointer;
        border: none;
        outline: none;
        margin-left: 20px;
        svg {
            width: 100%;
            //transition: transform .3s ease;
        }
        &:hover {
            //opacity: .6;
            svg {
                //transform: rotate(10deg);
            }
        }
    }
</style>
