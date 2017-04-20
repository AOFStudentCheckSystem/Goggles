/**
 * Created by liupeiqi on 2017/4/7.
 */
import * as types from '../mutation-types'
import { axia } from '../../main'

const state = {
    authenticated: false,
    error: false,
    email: null,
    level: null,
    student: null
}

const mutations = {
    [types.USER] (state, user) {
        state.email = user.email
        state.level = user.userLevel
        state.student = user.student
    },
    [types.USER_FAILURE] (state, error = false) {
        state.email = null
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
    suicide (state) {
        console.log(state)
    }
}

const actions = {
    authenticate: ({commit}, {username, password, callback}) => {
        const form = new FormData()
        form.append('email', username)
        form.append('password', password)
        axia.post('/auth/login', form).then((resp) => {
            commit(types.USER, resp.data.user)
            localStorage.setItem('Authorization', resp.data.token)
            axia.defaults.headers.common['Authorization'] = resp.data.token
            commit(types.USER_VERIFIED)
            callback({
                success: true
            })
        }).catch((err) => {
            commit(types.USER_FAILURE, err)
            callback({
                success: false,
                cause: err
            })
        })
    },
    verifyToken: ({state, commit}, {callback}) => {
        axia.get('/auth/verify')
            .then((resp) => {
                if (!state.authenticated) {
                    commit(types.USER, resp.data.user)
                    axia.defaults.headers.common['Authorization'] = resp.data.token
                    commit(types.USER_VERIFIED)
                }
                callback({
                    success: true
                })
            })
            .catch((err) => {
                commit(types.USER_FAILURE, err)
                callback({
                    success: false,
                    cause: err
                })
            })
    },
    signOut: ({commit}, {callback}) => {
        axia.get('/auth/logout')
            .then((resp) => {
                commit(types.USER_FAILURE)
                callback({
                    success: true
                })
            })
            .catch((err) => {
                commit(types.USER_FAILURE)
                callback({
                    success: false,
                    cause: err
                })
            })
    },
    setError ({commit}, payload) {
    }
}

export default {
    state,
    mutations,
    actions
}
