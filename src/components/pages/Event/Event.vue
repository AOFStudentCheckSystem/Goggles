<template>
    <div refs="eventView">
        <resize-watcher @resize="magic" listenWindow listenDOM></resize-watcher>
        <spinner v-if="loading"></spinner>
        <Table
            :columns="columns"
            :data="events"
            v-else
            :width="width - 60"
            style="margin: 30px"
            size="small"></Table>
    </div>
</template>

<style scoped>
</style>
<script>
    import Spinner from '../../Spinner'
    import moment from 'moment'
    import ResizeWatcher from '@/components/ResizeWatcher.vue'
    import {EventBus} from '../../../main'
    export default {
        components: {
            Spinner,
            ResizeWatcher
        },
        name: 'Event',
        data () {
            return {
                width: document.documentElement.clientWidth,
                sidenav: 0,
                loading: true,
                columns: [
                    {
                        title: 'ID',
                        key: 'id',
                        width: 50
//                        fixed: 'left'
                    },
                    {
                        title: 'Name',
                        key: 'eventName'
                    },
                    {
                        title: 'Description',
                        key: 'eventDescription'
                    },
                    {
                        title: 'Time',
                        key: 'eventTime',
                        width: 150
                    },
                    {
                        title: 'Status',
                        key: 'eventStatus',
                        width: 80
                    },
                    {
                        title: 'Operations',
                        key: 'action',
//                        fixed: 'right',
                        width: 150,
                        render () {
                            return `<i-button type="text" size="small">查看</i-button>
                                    <i-button type="text" size="small">编辑</i-button>`
                        }
                    }
                ]
            }
        },
        computed: {
            page () {
                return this.$store.state.event.page
            },
            totalPages () {
                return this.$store.state.event.totalPages
            },
            events () {
                return this.$store.state.event.events.map((event) => {
                    let newEvent = JSON.parse(JSON.stringify(event))
                    newEvent.eventTime = moment(newEvent.eventTime).format('YYYY-MM-DD hh:mm')
                    switch (newEvent.eventStatus) {
                        case -1: newEvent.eventStatus = 'Past'
                            break
                        case 0: newEvent.eventStatus = 'Future'
                            break
                        case 1: newEvent.eventStatus = 'Current'
                            break
                        default: newEvent.eventStatus = 'Unknown'
                    }
                    return newEvent
                })
            }
        },
        methods: {
            updateList () {
                const self = this
                this.$store.dispatch('fetchEvents', {
                    page: self.page,
                    callback (ret) {
                        if (ret.success) {
                            self.loading = false
                            EventBus.$emit('require-sidenav')
                        } else {
                            this.$Message.error('An error has occurred, try reload this page.')
                        }
                    }
                })
            },
            magic () {
                this.width = document.documentElement.clientWidth - this.sidenav
            }
        },
        mounted () {
            const self = this
            EventBus.$on('sidenav-resize', (size) => {
//                console.log('receive sidenav-resize:' + size)
                self.sidenav = size
                self.magic()
            })
            this.updateList()
        }
    }
</script>
