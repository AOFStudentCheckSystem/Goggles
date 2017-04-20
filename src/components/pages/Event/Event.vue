<template>
    <div>
        <resize-watcher @resize="magic" listenWindow listenDOM></resize-watcher>
        <spinner v-if="loading" :class="{'hide': loading}"></spinner>
        <div v-show="!loading">
            <i-button type="text" size="small" @click="add"><Icon type="plus" :size="24" style="margin: 15px 30px 15px 30px"></Icon></i-button>
            <Table
                :columns="columns"
                :data="events"
                :width="width - 60"
                style="margin: 0 30px 30px 30px"
                size="small"></Table>
            <div class="container">
                <Page :total="totalPages" :page-size="1" :current="page + 1" @on-change="changePage"></Page>
            </div>
        </div>
        <Modal v-model="showModal" :mask-closable="false" @on-cancel="cancel">
            <p slot="header" class="text-center">{{mode}} Event</p>
            <event-add v-if="mode === 'Add'"></event-add>
            <event-edit v-if="mode === 'Edit'" v-model="editing"></event-edit>
            <div v-if="mode === 'Delete'">
                <h1 class="text-center" style="margin-bottom: 20px">Are you sure?</h1>
                <Button type="primary" class="button" long @click="cancel">Cancel</Button>
                <Button type="error" class="button" long @click="remove(editing);cancel()">Confirm Delete</Button>
            </div>
            <div slot="footer" class="text-center">Created by Yaotian Feng, Yuanchu Xie, and Peiqi Liu</div>
        </Modal>
    </div>
</template>

<style scoped>
    .container {
        display: -webkit-flex;
        display:         flex;
        -webkit-align-items: center;
        align-items: center;
        -webkit-justify-content: center;
        justify-content: center;
    }
    .text-center {
        text-align:center
    }
    .hide {
        height: 0;
    }
    .button {
        margin-bottom: 10px;
    }
</style>
<script>
    import Spinner from '../../Spinner'
    import moment from 'moment'
    import ResizeWatcher from '@/components/ResizeWatcher.vue'
    import {EventBus} from '../../../main'
    import EventEdit from './EventEdit.vue'
    import EventAdd from './EventAdd.vue'
    import copy from '@/copy'
    export default {
        components: {
            Spinner,
            ResizeWatcher,
            EventEdit,
            EventAdd
        },
        name: 'Event',
        data () {
            return {
                width: document.documentElement.clientWidth,
                sidenav: 0,
                loading: true,
                showModal: false,
                mode: false,
                editing: null,
                columns: [
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
                        width: 180
                    },
                    {
                        title: 'Status',
                        key: 'eventStatus',
                        width: 100
                    },
                    {
                        title: 'Actions',
                        key: 'action',
                        fixed: 'right',
                        width: 150,
                        render (row, column, index) {
                            return `<i-button type="text" size="small" @click="edit(${index})">
                                        <Icon type="edit" :size="16"></Icon></i-button>
                                    <i-button type="text" size="small" @click="fakeDelete(${index})">
                                        <Icon type="trash-a" :size="16"></Icon></i-button>
                                    <i-button type="text" size="small" @click="view(${index})">
                                        <Icon type="ios-eye" :size="16"></Icon></i-button>`
                        }
                    }
                ]
            }
        },
        watch: {
            mode (newV, oldV) {
                this.showModal = !!newV
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
                    let newEvent = copy(event)
                    newEvent.eventTime = moment(newEvent.eventTime).format('YYYY-MM-DD ddd HH:mm')
                    switch (newEvent.eventStatus) {
                        case 0: newEvent.eventStatus = 'Scheduled'
                            break
                        case 1: newEvent.eventStatus = 'Boarding'
                            break
                        case 2: newEvent.eventStatus = 'Complete'
                            break
                        default: newEvent.eventStatus = 'Unknown'
                    }
                    return newEvent
                })
            }
        },
        methods: {
            updateList (first = false) {
                const self = this
                this.loading = true
                this.$store.dispatch('fetchEvents', {
                    page: self.page,
                    callback (ret) {
                        if (ret.success) {
                            self.loading = false
                            if (first) {
                                EventBus.$emit('require-sidenav')
                            }
                        } else {
                            self.$Message.error('An error has occurred, try reload this page.')
                        }
                    }
                })
            },
            magic () {
                this.width = document.documentElement.clientWidth - this.sidenav
            },
            changePage (newPage) {
//                console.log(newPage)
                this.$store.commit('EVENTS_PAGE', newPage - 1)
                this.updateList()
            },
            edit (index) {
                this.editing = copy(this.$store.state.event.events[index])
                this.editing.eventTime = moment(this.editing.eventTime).toDate()
                this.mode = 'Edit'
            },
            fakeDelete (index) {
                this.editing = this.events[index].eventId
                this.mode = 'Delete'
            },
            remove (id) {
                const self = this
                this.$store.dispatch('removeEvent', {
                    id: id,
                    callback (ret) {
                        if (ret.success) {
                            self.$Message.success('Event removed!')
                        } else {
                            self.$Message.error('An error has occurred!')
                            console.error(ret.cause)
                        }
                        self.updateList()
                    }
                })
            },
            cancel () {
                this.mode = false
                this.editing = null
            },
            add () {
                this.mode = 'Add'
            },
            view (index) {
                this.$router.push({
                    name: 'EventCheckList',
                    params: {
                        eventId: this.events[index].eventId
                    }
                })
            }
        },
        mounted () {
            const self = this
            EventBus.$on('sidenav-resize', (size) => {
//                console.log('receive sidenav-resize:' + size)
                self.sidenav = size
                self.magic()
            })
            EventBus.$on('form-submit', (channel) => {
                if (channel === 0) {
                    self.cancel()
                    self.updateList()
                }
            })
            this.updateList(true)
        }
    }
</script>
