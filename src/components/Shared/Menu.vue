<template>
    <nav class="fixed-left col-md-2">
        <nav class="nav nav-pills flex-column">
            <router-link class="nav-link" :to="{name: 'dashboard', params: { address: accountAddress }}">
                Dashboard
            </router-link>
            <router-link class="nav-link" :to="{name: 'collectibles', params: { address: accountAddress }}">
                Collectibles
            </router-link>
        </nav>
    </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'menu-left',
  computed: {
    ...mapState({
      accountAddress: state => state.account.address
    })
  }
}
</script>

<style scoped>
    .fixed-left {
        right: auto;
    }

    .fixed-left {
        bottom: 0;
        /*width: 232px;*/
        flex-flow: column nowrap;
        align-items: flex-start;
    }

    .fixed-left {
        position: fixed;
        top: 100px;
        left: 0;
        right: 0;
        z-index: 1030;
    }
</style>
