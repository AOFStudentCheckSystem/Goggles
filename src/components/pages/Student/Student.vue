<template>
    <div>
        <resize-watcher @resize="magic" listenWindow listenDOM></resize-watcher>
        <spinner v-if="loading"></spinner>
        <div v-else>
            <i-button type="text" size="small" @click="add"><Icon type="plus" :size="24" style="margin: 15px 30px 15px 30px"></Icon></i-button>
            <Table
                :columns="columns"
                :data="students"
                :width="width - 60"
                style="margin: 0 30px 30px 30px"
                size="small"></Table>
            <div class="container">
                <Page :total="totalPages" :page-size="1" :current="page + 1" @on-change="changePage"></Page>
            </div>
        </div>
        <Modal v-model="showModal" :mask-closable="false" @on-cancel="cancel">
            <p slot="header" class="text-center">{{mode}} Event</p>
            <!--<event-add v-if="mode === 'Add'"></event-add>-->
            <!--<event-edit v-if="mode === 'Edit'" v-model="editing"></event-edit>-->
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
</style>
<script>
    import Spinner from '../../Spinner'
    import ResizeWatcher from '@/components/ResizeWatcher.vue'
    import {EventBus} from '../../../main'
//    import EventEdit from './EventEdit.vue'
//    import EventAdd from './EventAdd.vue'
    import copy from '@/copy'
    export default {
        components: {
            Spinner,
            ResizeWatcher
//            EventEdit,
//            EventAdd
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
                        title: 'ID',
                        key: 'idNumber'
                    },
                    {
                        title: 'Last Name',
                        key: 'lastName'
                    },
                    {
                        title: 'First Name',
                        key: 'firstName'
                    },
                    {
                        title: 'Preferred Name',
                        key: 'preferredName'
                    },
                    {
                        title: 'Email',
                        key: 'email'
                    },
                    {
                        title: 'Card Record',
                        key: 'cardSecret'
                    },
                    {
                        title: 'Actions',
                        key: 'action',
                        fixed: 'right',
                        width: 100,
                        render (row, column, index) {
                            return `<i-button type="text" size="small" @click="edit(${index})">
                                        <Icon type="edit" :size="16"></Icon></i-button>
                                    <i-button type="text" size="small" @click="remove(${index})">
                                        <Icon type="trash-a" :size="16"></Icon></i-button>`
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
                return this.$store.state.student.page
            },
            totalPages () {
                return this.$store.state.student.totalPages
            },
            students () {
                return this.$store.state.student.students.map((event) => {
                    let newEvent = copy(event)
                    newEvent.email = newEvent.email ? 'Yes' : 'No'
                    newEvent.cardSecret = newEvent.cardSecret ? 'Yes' : 'No'
                    return newEvent
                })
            }
        },
        methods: {
            updateList (first = false) {
                const self = this
                this.loading = true
                this.$store.dispatch('fetchStudents', {
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
                this.$store.commit('STUDENTS_PAGE', newPage - 1)
                this.updateList()
            },
            edit (index) {
                this.editing = copy(this.$store.state.student.students[index])
                this.mode = 'Edit'
            },
            remove (index) {
                const self = this
                this.$store.dispatch('removeStudent', {
                    id: this.students[index].idNumber,
                    callback (ret) {
                        if (ret.success) {
                            self.$Message.success('Student removed!')
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
                if (channel === 3) {
                    self.cancel()
                    self.updateList()
                }
            })
            this.updateList(true)
        }
    }
</script>
