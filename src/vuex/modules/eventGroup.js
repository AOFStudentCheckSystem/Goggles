/**
 * Created by liupeiqi on 2017/4/13.
 */

import * as types from '../mutation-types'
import Vue from 'vue'
import {axia} from '../../main'

const state = {
    eventGroups: [],
    size: 10,
    page: 0,
    totalPages: 0
}

const mutations = {
    [types.EVENT_GROUPS] (state, {content, totalPages}) {
        Vue.set(state, 'eventGroups', content)
        state.totalPages = totalPages
    },
    [types.EVENT_GROUPS_SIZE] (state, size) {
        state.size = size
    },
    [types.EVENT_GROUPS_PAGE] (state, page) {
        state.page = page
    }
}

const actions = {
    fetchEventGroups ({state, commit}, {page, callback}) {
        axia.get('/event/group/list', {
            params: {
                size: state.size,
                page: page
            }
        })
            .then((resp) => {
                commit(types.EVENT_GROUPS, resp.data)
                commit(types.EVENT_GROUPS_PAGE, page)
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
    newEventGroup (store, {form, callback}) {
        const formData = new FormData()
        formData.append('name', form.name)
        if (form.groupItems) {
            formData.append('groupItems', JSON.stringify(form.groupItems))
        }
        axia.post('/event/group/new', formData)
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
    addEventToEventGroup (store, {eventId, eventGroupId, callback}) {
        let formData = new FormData()
        formData.append('eventId', eventId)
        axia.post('/event/group/edit/' + eventGroupId + '/add', formData)
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
    removeEventFromEventGroup (store, {eventId, eventGroupId, callback}) {
        let formData = new FormData()
        formData.append('eventId', eventId)
        axia.post('/event/group/edit/' + eventGroupId + '/remove', formData)
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
    removeEventGroup (store, {id, callback}) {
        axia.delete('/event/group/remove/' + id)
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
    fetchSingleEventGroup (store, {eventGroupId, callback}) {
        axia.get('/event/group/list/' + eventGroupId)
            .then((resp) => {
                callback({
                    success: true,
                    data: resp.data
                })
            })
            .catch((err) => {
                callback({
                    success: false,
                    cause: err
                })
            })
    },
    editEventGroup ({state}, {form, callback}) {
        let formData = new FormData()
        const ref = state.eventGroups.filter(eg => {
            return eg.id === form.id
        })[0]
        if (form.name !== ref.name) {
            formData.append('newName', form.name)
        }
        if (formData.has('newName')) {
            axia.post('/event/group/edit/' + form.id, formData)
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
    fetchAvailableEventGroups (store, {callback}) {
        axia.get('/event/group/list-available')
        .then((resp) => {
            callback({
                success: true,
                data: resp.data
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
