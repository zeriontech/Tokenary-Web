<template>
    <modal height="auto" :adaptive="true" name="createWalletModal">
        <div class="modal-content">
            <div class="row justify-content-center">
                <div class="col-sm-10">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title" id="exampleModalLabel">{{ $t('label') }}</h5>
                        <close-modal v-bind:modal-name="'createWalletModal'"/>
                    </div>
                    <div class="modal-body text-center">
                        <div>
                            Safe and easy to access your wallet in 3 steps.
                        </div>

                        <div>
                            <a target="_blank" class="mt10 mr10 mobile-text-center"
                               href="https://itunes.apple.com/app/apple-store/id1372886601?pt=119016031&amp;ct=Website&amp;mt=8">
                                <img width="150px" alt="Get Tokenary on AppStore" src="../../../assets/appstore.svg">
                            </a>
                            <a target="_blank"
                               href="https://play.google.com/store/apps/details?id=com.jufy.tokenary&amp;hl=en&amp;utm_source=tokenary.io&amp;utm_campaign=badge&amp;pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
                                <img width="150px" alt="Get Tokenary on Google Play"
                                     src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png">
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import CloseModal from '../../CloseModal'

export default {
  name: 'create-wallet-modal',
  components: {
    CloseModal
  }
}
</script>

<style scoped>
</style>

<i18n>
    {
        "en": {
            "label": "Get a New Wallet"
        },
        "ru": {
            "label": "Создайте новый кошелек"
        }
    }
</i18n>
