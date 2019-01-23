<template>
    <nav class=" card fixed-left col-md-1">
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
        padding-left: 0;
        bottom: 0;
        /*width: 232px;*/
        flex-flow: column nowrap;
        align-items: flex-start;
    }

    .nav-pills .nav-link {
        border-radius: 0;
    }

    .fixed-left {
        border-radius: 0;
        border-top: 0;
        border-bottom: 0;
        position: fixed;
        top: 65px;
        left: 0;
        right: 0;
        z-index: 1030;
    }
</style>
