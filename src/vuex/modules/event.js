/**
 * Created by liupeiqi on 2017/4/11.
 */

import * as types from '../mutation-types'
import Vue from 'vue'
import { axia } from '../../main'
import moment from 'moment'

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
                page: page,
                sort: 'eventTime,desc'
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
    },
    addEvent (store, {form, callback}) {
        const formData = new FormData()
        formData.append('name', form.name)
        if (form.time) {
            formData.append('time', moment(form.time).format('x'))
        }
        if (form.descriptions) {
            formData.append('descriptions', form.descriptions)
        }
        axia.post('/event/create', formData)
            .then((resp) => {
                let retObj = {success: resp.data.success}
                if (!resp.data.success) {
                    retObj.cause = resp.data.error
                }
                callback(retObj)
            }).catch((err) => {
                callback({
                    success: false,
                    cause: err
                })
            })
    },
    editEvent ({state}, {form, callback}) {
        const formData = new FormData()
        const ref = state.events.filter(ev => { return ev.eventId === form.eventId })[0]
        formData.append('eventId', form.eventId)
        let time = Number(moment(form.eventTime).format('x'))
        if (time !== ref.eventTime) {
            formData.append('newTime', time)
        }
        if (form.eventDescription !== ref.eventDescription) {
            formData.append('newDescription', form.eventDescription)
        }
        if (form.eventStatus !== ref.eventStatus) {
            formData.append('newStatus', form.eventStatus)
        }
        if (formData.has('newTime') || formData.has('newDescription') || formData.has('newStatus')) {
            axia.post('/event/edit', formData)
                .then((resp) => {
                    let retObj = {success: resp.data.success}
                    if (!resp.data.success) {
                        retObj.cause = resp.data.error
                    }
                    callback(retObj)
                }).catch((err) => {
                    callback({
                        success: false,
                        cause: err
                    })
                })
        } else {
            callback({success: true})
        }
    },
    removeEvent (store, {id, callback}) {
        axia.get('/event/remove/' + id)
            .then((resp) => {
                let retObj = {success: resp.data.success}
                if (!resp.data.success) {
                    retObj.cause = resp.data.error
                }
                callback(retObj)
            }).catch((err) => {
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
