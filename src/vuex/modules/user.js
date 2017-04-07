/**
 * Created by liupeiqi on 2017/4/7.
 */
import * as types from '../mutation-types'

const state = {
    token: '',
    authenticated: false,
    error: false,
    phone: null,
    name: '',
    email: null,
    id: null,
    mfa: null,
    loginHistory: []
}

const mutations = {
    [types.USER] (state, {token, mfa = false}) {
        state.token = token
        state.authenticated = true
        state.mfa = mfa
    },
    [types.USER_FAILURE] (state) {
        state.authenticated = false
    },
    [types.USER_ERROR] (state, {error}) {
        state.error = error
    },
    [types.USER_PHONE_CHANGE] (state, {phone}) {
        state.phone = phone
    },
    [types.USER_NAME_CHANGE] (state, {name}) {
        state.name = name
    },
    [types.USER_EMAIL_CHANGE] (state, {email}) {
        state.email = email
    },
    [types.USER_ID_CHANGE] (state, {id}) {
        state.id = id
    },
    [types.USER_MFA_STATUS_CHANGE] (state, {newStatus}) {
        state.mfa = newStatus
    },
    [types.USER_LOGIN_HISTORY_CHANGE] (state, {newHistory}) {
        if (state.loginHistory.length > 0) {
            state.loginHistory.splice(0, state.loginHistory.length)
        }
        newHistory.forEach((item) => {
            state.loginHistory.push(item)
        })
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
