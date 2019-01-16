<template>
  <modal height="auto" :adaptive="true" name="settingsModal">
    <div class="modal-content">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="modal-header justify-content-center">
            <h5 class="modal-title" id="exampleModalLabel">{{ $t('settings_label') }}</h5>
            <close-modal v-bind:modal-name="'settingsModal'"/>
          </div>
          <div class="modal-body">
            <currency-changer/>
            <locale-changer v-bind:showLabel="true"/>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import CloseModal from './CloseModal'
import CurrencyChanger from './Shared/CurrencyChanger'
import LocaleChanger from './Shared/LocaleChanger'

export default {
  name: 'settings-form',
  components: {
    CloseModal,
    CurrencyChanger,
    LocaleChanger
  }
}
</script>

<style scoped>

</style>

<i18n>
  {
    "en": {
      "settings_label": "Settings"
    },
    "ru": {
      "settings_label": "Настройки"
    }
  }
</i18n>
