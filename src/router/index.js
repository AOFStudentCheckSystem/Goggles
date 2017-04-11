import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/pages/Dashboard/Dashboard.vue'
import Event from '@/components/pages/Event/Event.vue'
import EventEdit from '@/components/pages/Event/EventEdit.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/Event/:id',
            name: 'EventEdit',
            component: EventEdit
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
