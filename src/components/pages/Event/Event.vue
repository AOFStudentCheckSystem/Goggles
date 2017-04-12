<template>
    <div>
        <spinner v-if="loading"></spinner>
        <Table
            :columns="columns"
            :data="events"
            v-else
            :width="width - ((width > 768)?240:80) - 60"
            style="margin: 30px"
            size="small"></Table>
    </div>
</template>

<style scoped>
</style>
<script>
    import Spinner from '../../Spinner'
    import moment from 'moment'
    export default {
        components: {Spinner},
        name: 'Event',
        data () {
            return {
                width: document.documentElement.clientWidth,
                loading: true,
                columns: [
                    {
                        title: 'ID',
                        key: 'id',
                        width: 50
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
                        } else {
                            this.$Message.error('An error has occurred, try reload this page.')
                        }
                    }
                })
            },
            changeWidth () {
                this.width = document.documentElement.clientWidth
            }
        },
        mounted () {
            window.addEventListener('resize', this.changeWidth)
            this.updateList()
        },
        beforeDestroy () {
            window.removeEventListener('resize', this.changeWidth)
        }
    }
</script>
