<template>
    <div class="col-md-12">
        <div v-if="transfers.length > 0">
            {{ $t('transfers') }}:
            <div style="width:100%; max-height:382px; overflow:scroll;">
            <span style="font-size: 10px;" v-bind:key="i" v-for="(transfer, i) in transfers">
              from: {{transfer.from}} to {{transfer.to}} for {{transfer.value}}
            </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'transaction-transfers',
  props: ['transfers']
}
</script>

<style scoped>
    div {
        display: inline-block;
    }
</style>

<i18n>
    {
        "en": {
            "transfers": "Transfers"
        },
        "ru": {
            "transfers": "Трансферы"
        }
    }
</i18n>
