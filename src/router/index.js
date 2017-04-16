import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/pages/Dashboard/Dashboard.vue'
import Event from '@/components/pages/Event/Event.vue'
import EventGroup from '@/components/pages/EventGroup/EventGroup.vue'
import Sheet from '@/components/pages/Sheet/Sheet.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/Sheet',
            name: 'Sheet',
            component: Sheet
        },
        {
            path: '/EventGroup',
            name: 'EventGroup',
            component: EventGroup
        },
        {
            path: '/Event',
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
