<template>
    <div class="locale-changer form-group">
        <div class="col-md-12">
            <select id="lang" name="lang" class="form-control" v-model="currentLang">
                <option v-for="(lang, i) in languages" v-bind:key="i" v-bind:value="i">{{ lang }}</option>
            </select>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ACCOUNT_UPDATE_LANGUAGE } from '../../store/modules/actions.type'
import languages from '../../common/json/languages'

export default {
  name: 'locale-changer',
  data () {
    return {
      languages: languages
    }
  },
  computed: {
    ...mapGetters([
      'getAccountLanguage'
    ]),
    currentLang: {
      get () {
        return this.getAccountLanguage
      },
      set (value) {
        this[ACCOUNT_UPDATE_LANGUAGE](value)
        this.$i18n.locale = value
      }
    }
  },
  methods: {
    ...mapActions([
      ACCOUNT_UPDATE_LANGUAGE
    ])
  }
}
</script>

<style lang="scss" scoped>
  .locale-changer {
    margin-right: 10px;
    select {
      height: 30px !important;
    }
  }
  .form-control {
    font-size: 1.5rem;
  }
  label {
    margin-bottom: 0;
  }
</style>
