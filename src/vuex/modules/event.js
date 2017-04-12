/**
 * Created by liupeiqi on 2017/4/11.
 */

import * as types from '../mutation-types'
import Vue from 'vue'
import { axia } from '../../main'

const state = {
    events: [],
    size: 10,
    page: 0,
    totalPages: 0
}

const mutations = {
    [types.EVENTS] (state, {content, totalPages}) {
        Vue.set(state, 'events', content)
        state.totalPages = totalPages
    },
    [types.EVENTS_SIZE] (state, size) {
        state.size = size
    },
    [types.EVENTS_PAGE] (state, page) {
        state.page = page
    }
}

const actions = {
    fetchEvents ({state, commit}, {page, callback}) {
        axia.get('/event/list', {
            params: {
                size: state.size,
                page: page
            }
        })
            .then((resp) => {
                commit(types.EVENTS, resp.data)
                commit(types.EVENTS_PAGE, page)
                callback({
                    success: true
                })
            })
            .catch((err) => {
                callback({
                    success: false,
                    cause: err
                })
            })
    }
}

export default {
    state,
    mutations,
    actions
}
