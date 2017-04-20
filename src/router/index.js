import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/pages/Dashboard/Dashboard.vue'
import Event from '@/components/pages/Event/Event.vue'
import EventCheckList from '@/components/pages/Event/EventCheckList.vue'
import EventGroup from '@/components/pages/EventGroup/EventGroup.vue'
import Sheet from '@/components/pages/Sheet/Sheet.vue'
import Student from '@/components/pages/Student/Student.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/student',
            name: 'Student',
            component: Student
        },
        {
            path: '/sheet',
            name: 'Sheet',
            component: Sheet
        },
        {
            path: '/eventgroup',
            name: 'EventGroup',
            component: EventGroup
        },
        {
            path: '/eventchecklist/:eventId',
            name: 'EventCheckList',
            component: EventCheckList
        },
        {
            path: '/event',
            name: 'Event',
            component: Event
        },
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard
        }
    ]
})
