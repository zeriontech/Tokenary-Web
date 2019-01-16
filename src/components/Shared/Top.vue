<template>
  <header class="fixed-top">
    <notification/>
    <navigation/>
  </header>
</template>

<script>
import Navigation from './Navigation'
import Notification from './Notification'

export default {
  name: 'top',
  components: {
    Navigation,
    Notification
  }
}
</script>

<style lang="scss" scoped>
  header {
    background: white;
    border-bottom: 1px solid rgba(0,0,0,.0975);
  }
</style>
