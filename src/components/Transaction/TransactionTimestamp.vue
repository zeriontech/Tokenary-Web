<template>
    <div class="tx-timestamp" v-if="timestamp != null">
        {{ timestamp }}
    </div>
</template>

<script>
export default {
  name: 'transaction-timestamp',
  props: ['timestamp']
}
</script>

<style lang="scss" scoped>
    .tx-timestamp {
        color: $lightGrey;
    }
</style>

<i18n>
    {
        "en": {
            "date": "Date"
        },
        "ru": {
            "date": "Дата"
        }
    }
</i18n>
