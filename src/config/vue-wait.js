import Vue from 'vue'
import VueWait from 'vue-wait'

Vue.use(VueWait)

export default new VueWait({
  // Defaults values are following:
  useVuex: true, // Uses Vuex to manage wait state
  vuexModuleName: 'wait', // Vuex module name
  accessorName: '$wait',

  registerComponent: true, // Registers `v-wait` component
  componentName: 'v-wait' // <v-wait> component name, you can set `my-loader` etc.
})
