<template>
    <div class="tx-timestamp" v-if="timestamp != null">
        {{ timestamp }}
    </div>
</template>

<script>
export default {
  name: 'tx-timestamp',
  props: ['timestamp']
}
</script>

<style lang="scss" scoped>
    .tx-timestamp {
        color: $lightGrey;
    }
</style>
