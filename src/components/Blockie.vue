<template>
    <img class="icon blockie" :src=getBlockie(data)>
</template>

<script>
import mixins from '../mixins.js'

export default {
  name: 'blockie',
  props: {
    data: [String]
  },
  mixins: [mixins]
}
</script>

<style lang="scss" scoped>

  .icon {
    max-width: 100px;
    max-height: 100px;
    border-radius: 50%;
    object-fit: contain;
      border: 1px solid lighten($lightGrey, 30%);
      box-sizing: border-box;
  }

</style>
