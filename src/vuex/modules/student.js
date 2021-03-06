/**
 * Created by liupeiqi on 2017/4/18.
 */

import * as types from '../mutation-types'
import Vue from 'vue'
import {axia} from '../../main'

const state = {
    students: [],
    size: 10,
    page: 0,
    totalPages: 0,
    searching: false
}

const mutations = {
    [types.STUDENTS] (state, {content, totalPages}) {
        Vue.set(state, 'students', content)
        state.totalPages = totalPages
    },
    [types.STUDENTS_SIZE] (state, size) {
        state.size = size
    },
    [types.STUDENTS_PAGE] (state, page) {
        state.page = page
    },
    [types.STUDENTS_SEARCHING] (state, bool) {
        state.searching = bool
    },
    [types.STUDENTS_SORT] (state, sortStr) {
        let params = sortStr.split(',')
        // console.log(params)
        state.students.sort((a, b) => {
            let ascResult = a[params[0]] < b[params[0]] ? -1 : +(a[params[0]] > b[params[0]])
            // console.log(a[params[0]] + ' vs ' + b[params[0]] + ' => ' + (ascResult * (params[1] === 'asc' ? 1 : -1)))
            return ascResult * (params[1] === 'asc' ? 1 : -1)
        })
        // console.log('sortDone')
    }
}

const actions = {
    fetchStudents ({state, commit}, {page, sort = 'lastName,asc', callback}) {
        axia.get('/student/list', {
            params: {
                size: state.size,
                page: page,
                sort: sort
            }
        })
        .then((resp) => {
            commit(types.STUDENTS, resp.data)
            commit(types.STUDENTS_PAGE, page)
            commit(types.STUDENTS_SEARCHING, false)
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
    addStudent (store, {form, callback}) {
        const formData = new FormData()
        formData.append('firstName', form.firstName)
        formData.append('lastName', form.lastName)
        formData.append('idNumber', form.idNumber)
        if (form.preferredName) {
            formData.append('preferredName', form.preferredName)
        }
        if (form.email) {
            formData.append('email', form.email)
        }
        axia.post('/student/create', formData)
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
    editStudent ({state}, {form, callback}) {
        const formData = new FormData()
        const ref = state.students.filter(s => {
            return Number(s.idNumber) === form.idNumber
        })[0]
        formData.append('idNumber', form.idNumber)
        if (form.firstName !== ref.firstName) {
            formData.append('firstName', form.firstName)
        }
        if (form.lastName !== ref.lastName) {
            formData.append('lastName', form.lastName)
        }
        if (form.preferredName !== ref.preferredName) {
            formData.append('preferredName', form.preferredName)
        }
        if (form.email !== ref.email) {
            formData.append('email', form.email)
        }
        if (form.cardSecret !== ref.cardSecret) {
            formData.append('cardSecret', form.cardSecret)
        }
        if (form.studentType !== ref.studentType) {
            formData.append('studentType', form.studentType)
        }
        if (form.dorm !== ref.dorm) {
            formData.append('dorm', form.dorm)
        }
        if (form.grade !== ref.grade) {
            formData.append('grade', form.grade)
        }
        if (formData.has('firstName') || formData.has('lastName') || formData.has('preferredName') || formData.has('email') || formData.has('cardSecret') || formData.has('studentType') || formData.has('dorm') || formData.has('grade')) {
            axia.post('/student/edit', formData)
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
    removeStudent (store, {id, callback}) {
        axia.delete('/student/remove/' + id)
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
    searchStudents ({state, commit}, {page, search, filter, sort = 'lastName,asc', callback}) {
        axia.get('/student/listall', {
            params: {
                sort: sort
            }
        })
        .then((resp) => {
            // console.log('recieved')
            let allStudents = resp.data.filter((student) => {
                return student[filter].toLowerCase().startsWith(search.toLowerCase())
            })
            // console.log(allStudents.length)
            commit(types.STUDENTS, {
                content: allStudents,
                totalPages: Math.max(Math.floor((allStudents.length - 1) / state.size), 0) + 1
            })
            // console.log(state.totalPages)
            commit(types.STUDENTS_PAGE, page)
            commit(types.STUDENTS_SEARCHING, true)
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
