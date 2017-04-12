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
import 'vue-resize/dist/vue-resize.css'
import VueResize from 'vue-resize/dist/vue-resize'
Vue.use(VueResize)
export const axia = axios.create({
    baseURL: `https://check.guardiantech.com.cn`
})

export const EventBus = new Vue()

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
})
