<template>
  <div class="network-status bg-danger" v-if="OfflineOnly">
    <div class="container text-center">
        You are Offline
    </div>
  </div>
</template>

<script>

export default {
  name: 'network-status'
}
</script>

<style>
  .network-status {
    color: white;
  }
</style>
