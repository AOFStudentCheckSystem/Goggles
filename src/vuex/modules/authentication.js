/*
 * Copyright (c) 2016. Codetector (Yaotian Feng)
 */

import * as types from '../mutation-types'

const state = {
    token: '',
    authenticated: false,
    isMfa: false,
    error: false
}

const mutations = {
    [types.AUTHENTICATION] (state, {token, mfa = false}) {
        state.token = token
        state.authenticated = true
        state.isMfa = mfa
    },
    [types.AUTHENTICATION_FAILURE] (state) {
        state.authenticated = false
    },
    [types.AUTHENTICATION_ERROR] (state, {error}) {
        state.error = error
    }
}

const actions = {
    authenticate: ({commit, dispatch}, {username, password, callback}) => {
    },
    verifyToken: ({state, commit, dispatch}, {callback}) => {
    },
    signOut: ({commit}) => {
    },
    setError ({commit}, payload) {
    }
}

export default {
    state,
    mutations,
    actions
}
