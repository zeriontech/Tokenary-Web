<template>
    <div class="col-md-12">
        {{ $t('status')}}: {{!hasSucceed ? $t('status_failed') : $t('status_succeed')}}
    </div>
</template>

<script>
export default {
  name: 'transaction-status',
  props: ['hasSucceed']
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
            "status": "Status",
            "status_succeed": "Succeed",
            "status_failed": "Failed"
        },
        "ru": {
            "status": "Статус",
            "status_succeed": "Успешно",
            "status_failed": "Не успешно"
        }
    }
</i18n>
