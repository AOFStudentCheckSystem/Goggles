<template>
    <div>
        <spinner v-if="loading" :class="{'hide': loading}"></spinner>
        <div v-show="!loading" style="padding-bottom: 2000px">
            <i-button type="text" size="small" @click="$router.push({name: 'Event'})"
                      style="margin: 15px 5px 15px 30px">
                <Icon type="chevron-left" :size="24"></Icon>
            </i-button>
            <i-button type="text" size="small" style="margin: 15px 30px 15px 5px" @click="print">
                <Icon type="printer" :size="24"></Icon>
            </i-button>
            <div class="print-section" style="margin-top: 30px">
                <div class="container">
                    <h1 v-if="event !== null">{{event.eventName}} @ {{event.eventTime}}</h1>
                    <h1 v-else>No Data!</h1>
                </div>
                <div class="container">
                    <Table
                        :columns="columns"
                        :data="data"
                        style="margin: 0 30px 30px 30px"
                        :width="661"></Table>
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
    }

    .hide {
        height: 0;
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
        name: 'EventCheckList',
        data () {
            return {
                sidenav: 0,
                loading: false,
                columns: [
                    {
                        title: 'Last Name',
                        key: 'lastName',
                        width: 110
                    },
                    {
                        title: 'First Name',
                        key: 'firstName',
                        width: 110
                    },
                    {
                        title: 'Nick Name',
                        key: 'preferredName',
                        width: 110
                    },
                    {
                        title: 'Dorm',
                        key: 'dorm',
                        width: 110
                    },
                    {
                        title: 'Sign up',
                        key: 'signupTime',
                        width: 110
                    },
                    {
                        title: 'Check-in',
                        key: 'checkInTime',
                        width: 110
                    }
                ],
                data: [],
                event: null
            }
        },
        methods: {
            updateList () {
                const self = this
                this.loading = true
                this.$store.dispatch('fetchEventCheckList', {
                    eventId: this.$route.params.eventId,
                    callback (ret) {
                        if (ret.success) {
                            if (ret.data.records.length) {
                                self.event = ret.data.records[0].event
                                self.event.eventTime = moment(self.event.eventTime).format('ddd MM/DD HH:mm')
                            }
                            self.data = ret.data.records.sort((a, b) => {
                                return (a.student.lastName < b.student.lastName ? -1 : (a.student.lastName > b.student.lastName ? 1 : 0))
                            }).map(r => {
                                let record = copy(r)
                                record.lastName = record.student.lastName
                                record.firstName = record.student.firstName
                                record.preferredName = record.student.preferredName
                                record.dorm = record.student.dorm
                                record.signupTime = record.signupTime >= 0 ? 'Yes' : 'No'
                                record.checkInTime = record.checkInTime >= 0 ? moment(record.checkInTime).format('HH:mm:ss') : 'Left'
                                return record
                            })
                            self.loading = false
                        } else {
                            self.$Message.error('An error has occurred, try reload this page.')
                        }
                    }
                })
            },
            magic () {
                this.width = document.documentElement.clientWidth - this.sidenav
            },
            print () {
                window.print()
            }
        },
        mounted () {
            this.updateList()
        }
    }
</script>
