<template>
    <div id="app">
        <modals/>
        <top/>
        <router-view class="content"/>
        <bottom/>
    </div>
</template>

<script>
import Top from './components/Shared/Top'
import Bottom from './components/Shared/Bottom'
import Modals from './components/Shared/Modals'

export default {
  components: {
    Top,
    Bottom,
    Modals
  },
  name: 'app'
}
</script>

<style>
  .content {
      margin-top: 100px;
  }
</style>
