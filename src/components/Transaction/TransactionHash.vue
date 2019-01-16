<template>
    <div class="col-md-12" v-if="hash != null">
        {{ $t('hash') }}: {{ hash }}
    </div>
</template>

<script>
export default {
  name: 'transaction-hash',
  props: ['hash']
}
</script>

<i18n>
    {
        "en": {
            "hash": "Hash"
        },
        "ru": {
            "hash": "Хэш"
        }
    }
</i18n>
