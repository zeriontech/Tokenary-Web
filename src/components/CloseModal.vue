<template>
    <button type="button" class="close icon-wrapper" @click="hideModal()" aria-label="Close">
        <XIcon />
    </button>
</template>

<script>
import { XIcon } from 'vue-feather-icons'
export default {
  name: 'close-modal',
  props: ['modalName'],
  components: {
    XIcon
  },
  methods: {
    hideModal () {
      this.$modal.hide(this.modalName)
    }
  }
}
</script>

<style scoped>
</style>
