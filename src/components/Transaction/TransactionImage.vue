<template>
    <div>
        <img v-if="url" v-bind:src="url" width="50" height="50">
        <blockie v-else class="circle" v-bind:data="hash" width="50" height="50"></blockie>
    </div>
</template>

<script>
import Blockie from '../Blockie'

export default {
  name: 'transaction-image',
  props: ['transaction'],
  components: {
    Blockie
  }
}
</script>
