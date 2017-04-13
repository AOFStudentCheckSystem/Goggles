import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/pages/Dashboard/Dashboard.vue'
import Event from '@/components/pages/Event/Event.vue'

Vue.use(Router)

export default new Router({
    routes: [
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
