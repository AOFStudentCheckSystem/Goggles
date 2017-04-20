import modules from './modules'
// import {localStoragePlugin} from './plugins'
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules,
    // plugins: [localStoragePlugin],
    strict: process.env.NODE_ENV !== 'production'
})

