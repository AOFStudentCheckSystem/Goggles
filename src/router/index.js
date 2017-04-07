import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/pages/Dashboard/Dashboard.vue'
import EventModify from '@/components/pages/Event/EventModify.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/EventModify',
            name: 'EventModify',
            component: EventModify
        },
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard
        }
    ]
})
