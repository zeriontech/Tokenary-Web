<template>
    <div class="img-wrapper">
        <div v-if="transaction.type === 'contract_deployment'" class="img img-background contract-deployment"></div>
        <div v-else-if="transaction.type === 'contract_execution'" class="img img-background contract-execution"></div>
        <div v-else-if="showLogo && transaction.image !== null && transaction.image.url !== null" class="img">
            <img width="50px" height="50px" :src="transaction.image.url" />
        </div>
        <blockie v-else class="circle" v-bind:data="direction.address" width="50" height="50"/>
    </div>
</template>

<script>
import Blockie from '../Blockie'

export default {
  name: 'tx-image',
  props: ['transaction', 'showLogo', 'direction'],
  components: {
    Blockie
  }
}
</script>

<style lang="scss">
    .img {
        content: "";
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }

    .img-background {
        background-size: contain;
        border: 1px solid lighten($lightGrey, 30%);
        box-sizing: border-box;
    }

    .contract-deployment {
        background: url('../../assets/contract_deployment.svg') center no-repeat;
    }

    .contract-execution {
        background: url('../../assets/contract_execution.svg') center no-repeat;
    }
</style>
