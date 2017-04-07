/**
 * Created by codetector on 29/12/2016.
 */
/*
 * Copyright (c) 2016. Codetector (Yaotian Feng)
 */

import * as types from '../mutation-types'

const state = {
    display: false
}

const mutations = {
    [types.HIDE_LOADING_SPINNER] (state) {
        state.display = false
    },
    [types.SHOW_LOADING_SPINNER] (state) {
        state.display = true
    }
}

const actions = {}

export default {
    state,
    mutations,
    actions
}
