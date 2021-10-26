import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import { parseUrl } from '../package/lib/index.js';
let url = parseUrl(window.location)
console.log('[ url ]', url);

new Vue({
  render: h => h(App),
}).$mount('#app')
