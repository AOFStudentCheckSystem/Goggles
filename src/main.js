// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import {store} from './vuex/store'
Vue.config.productionTip = false
Vue.use(iView)
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

// Vue.axios.defaults.baseURL = 'http://localhost:10492'
Vue.axios.defaults.baseURL = 'http://hn2.guardiantech.com.cn:10493'
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
})
