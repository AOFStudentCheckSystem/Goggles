/**
 * Created by liupeiqi on 2017/4/15.
 */

import * as types from '../mutation-types'
import Vue from 'vue'
import {axia} from '../../main'

const state = {
    sheets: []
}

const mutations = {
    [types.SHEETS] (state, {signUps}) {
        Vue.set(state, 'sheets', signUps)
    }
}

const actions = {
    fetchSheets ({state, commit}, {callback}) {
        axia.get('/signup/list')
        .then((resp) => {
            commit(types.SHEETS, resp.data)
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
    newSheet (store, {form, callback}) {
        const formData = new FormData()
        formData.append('name', form.name)
        if (form.groups) {
            formData.append('groups', JSON.stringify(form.groups))
        }
        axia.post('/signup/create', formData)
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
    addEventGroupToSheet (store, {eventGroupId, sheetId, callback}) {
        let formData = new FormData()
        formData.append('id', eventGroupId)
        axia.post('/signup/edit/' + sheetId + '/add', formData)
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
    removeEventGroupFromSheet (store, {eventGroupId, sheetId, callback}) {
        let formData = new FormData()
        formData.append('id', eventGroupId)
        axia.post('/event/group/edit/' + sheetId + '/remove', formData)
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
    fetchSingleSheet (store, {sheetId, callback}) {
        axia.get('/signup/find/' + sheetId)
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
        const ref = state.sheets.filter(s => {
            return s.id === form.id
        })[0]
        if (form.name !== ref.name) {
            formData.append('newName', form.name)
        }
        if (formData.has('newName')) {
            axia.post('/signup/edit/' + form.id, formData)
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
    }
}

export default {
    state,
    mutations,
    actions
}
