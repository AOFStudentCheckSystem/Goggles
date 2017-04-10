/**
 * Created by liupeiqi on 2017/4/7.
 */
import * as types from '../mutation-types'
import Vue from 'vue'

const state = {
    authenticated: false,
    error: false,
    email: null,
    id: null,
    level: null,
    student: null
}

const mutations = {
    [types.USER] (state, {email, user}) {
        state.email = email
        state.id = user.userId
        state.level = user.userLevel
        state.student = user.student
    },
    [types.USER_FAILURE] (state, {error}) {
        state.email = null
        state.id = null
        state.level = null
        state.student = null
        state.error = error
        localStorage.removeItem('Authorization')
        state.authenticated = false
    },
    [types.USER_VERIFIED] (state) {
        state.authenticated = true
    },
    [types.USER_ERROR] (state, {error}) {
        state.error = error
    },
    [types.USER_EMAIL_CHANGE] (state, {email}) {
        state.email = email
    },
    [types.USER_ID_CHANGE] (state, {id}) {
        state.id = id
    }
}

const actions = {
    authenticate: ({commit}, {username, password, callback}) => {
        Vue.axios.post('/auth/login', {
            email: username,
            password: password
        }).then((resp) => {
            commit(types.USER, resp)
            localStorage.setItem('Authorization', resp.tokenSecret)
            Vue.axios.defaults.headers.common['Authorization'] = resp.tokenSecret
            commit(types.USER_VERIFIED)
            callback({
                success: true
            })
        }).catch((err) => {
            commit(types.USER_FAILURE, {err})
            callback({
                success: false,
                cause: err
            })
        })
    },
    verifyToken: ({state, commit}, {callback}) => {
        Vue.axios.get('/auth/verify')
            .then((resp) => {
                if (!state.authenticated) {
                    commit(types.USER, resp)
                    Vue.axios.defaults.headers.common['Authorization'] = resp.tokenSecret
                    commit(types.USER_VERIFIED)
                }
                callback({
                    success: true
                })
            })
            .catch((err) => {
                commit(types.USER_FAILURE, {err})
                callback({
                    success: false,
                    cause: err
                })
            })
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
