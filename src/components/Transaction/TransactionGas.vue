<template>
    <div class="col-md-12">
        <div>
            {{ $t('gas') }}: {{gas}}
        </div>
        <div>
            {{ $t('gasUsed') }}: {{gasUsed}}
        </div>
        <div>
            {{ $t('gasPrice') }}: {{gasPrice}} Gwei
        </div>
    </div>
</template>

<script>
export default {
  name: 'transaction-gas',
  props: ['gas', 'gasUsed', 'gasPrice']
}
</script>

<i18n>
    {
        "en": {
            "gas": "Gas",
            "gasUsed": "Gas Used",
            "gasPrice": "Gas Price"
        },
        "ru": {
            "gas": "Газ",
            "gasUsed": "Использовано",
            "gasPrice": "Цена"
        }
    }
</i18n>
