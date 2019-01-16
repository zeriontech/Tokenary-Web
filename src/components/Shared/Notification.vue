<template>
    <div>
        <network-status/>
        <notifications width="98%" position="top center" group="all">
            <template slot="body" slot-scope="props">
                <div class="notify-wrapper">
                    <a class="notify-title">
                        {{props.item.title}}
                    </a>
                    <a class="close" @click="props.close">
                        CLOSE
                    </a>
                    <div v-html="props.item.text">
                    </div>
                </div>
            </template>
        </notifications>
    </div>
</template>

<script>
import NetworkStatus from './NetworkStatus'

export default {
  name: 'notification',
  components: {
    NetworkStatus
  }
}
</script>

<style scoped>
    .notifications {
        margin-top: 10px;
    }

    .notify-wrapper {
        text-align: center;
        border-radius: 20px;
        font-size: 1.4rem;
        background-color: rgb(255, 0, 9);
    }

    .notify-title {
        font-size: 2rem;
    }
</style>
