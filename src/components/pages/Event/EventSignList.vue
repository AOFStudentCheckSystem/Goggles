<template>
    <div>
        <spinner v-if="loading" :class="{'hide': loading}"></spinner>
        <div v-show="!loading">
            <Tooltip content="Go back" placement="top">
                <i-button type="text" size="small" @click="$router.push({name: 'Event'})"
                          style="margin: 15px 5px 15px 30px">
                    <Icon type="chevron-left" :size="24"></Icon>
                </i-button>
            </Tooltip>
            <Tooltip content="Print page" placement="top">
                <i-button type="text" size="small" style="margin: 15px 0 15px 5px" @click="print">
                    <Icon type="printer" :size="24"></Icon>
                </i-button>
            </Tooltip>
            <Tooltip content="Export csv" placement="top">
                <i-button type="text" size="small" style="margin: 15px 0 15px 5px" @click="exportCsv">
                    <Icon type="ios-download" :size="24"></Icon>
                </i-button>
            </Tooltip>
            <div class="print-section" style="margin-top: 30px">
                <div class="container">
                    <h1 v-if="event !== undefined">{{event.eventName}}</h1>
                    <div v-if="event !== undefined">
                        <span>Time: {{eventTime}}</span>
                        <span style="margin-left: 20px">Total:{{data.length}}</span>
                    </div>
                    <h1 v-else>No Data!</h1>
                </div>
                <div class="container">
                    <Table
                        :columns="columns"
                        :data="data"
                        style="margin: 0 30px 30px 30px"
                        :width="661"
                        ref="table"></Table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container {
        display: -webkit-flex;
        display: flex;
        -webkit-align-items: center;
        align-items: center;
        -webkit-justify-content: center;
        justify-content: center;
        flex-direction: column;
    }

    .hide {
        height: 0;
    }

    .text-center {
        text-align: center;
    }
</style>
<script>
    import Spinner from '../../Spinner'
    import moment from 'moment'
    import copy from '@/copy'
    export default {
        components: {
            Spinner
        },
        name: 'EventSignList',
        data () {
            return {
                sidenav: 0,
                loading: false,
                columns: [
                    {
                        title: 'Last Name',
                        key: 'lastName',
                        width: 132
                    },
                    {
                        title: 'First Name',
                        key: 'firstName',
                        width: 132
                    },
                    {
                        title: 'Nick Name',
                        key: 'preferredName',
                        width: 132
                    },
                    {
                        title: 'Dorm',
                        key: 'dorm',
                        width: 132
                    },
                    {
                        title: 'Sign-up Time',
                        key: 'signupTime',
                        width: 132
                    }
                ],
                data: [],
                showModal: false,
                event: undefined
            }
        },
        methods: {
            updateList () {
//                console.log('called')
                const self = this
                this.loading = true
                this.$store.dispatch('fetchEventCheckList', {
                    eventId: this.$route.params['eventId'],
                    callback (ret) {
                        if (ret.success) {
                            self.data = ret.data.records.filter(r => {
                                return r.signupTime >= 0
                            }).sort((a, b) => {
                                return (a.student.lastName < b.student.lastName ? -1 : (a.student.lastName > b.student.lastName ? 1 : 0))
                            }).map(r => {
                                let record = copy(r)
                                record.lastName = record.student.lastName
                                record.firstName = record.student.firstName
                                record.preferredName = record.student.preferredName
                                record.dorm = record.student.dorm
                                record.signupTime = moment(record.signupTime).format('ddd HH:mm:ss')
                                return record
                            })
                            self.loading = false
                        } else {
                            self.$Message.error('An error has occurred, try reload this page.')
                        }
                        self.loading = false
                    }
                })
            },
            print () {
                window.print()
            },
            exportCsv () {
                this.$refs.table.exportCsv({
                    filename: 'EventSignList'
                })
            }
        },
        mounted () {
            const self = this
            if (this.$store.state.event.events.length === 0) {
                this.$nextTick(() => {
                    self.$router.push({
                        name: 'Event'
                    })
                })
            } else {
                this.loading = true
                this.event = this.$store.state.event.events.filter(ev => {
                    return ev.eventId === self.$route.params['eventId']
                })[0]
                this.updateList()
            }
        },
        computed: {
            eventTime () {
                return moment(this.event.eventTime).format('ddd MM/DD HH:mm')
            }
        }
    }
</script>
