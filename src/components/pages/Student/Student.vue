<template>
    <div>
        <resize-watcher @resize="magic" listenWindow listenDOM></resize-watcher>
        <spinner v-if="loading" :class="{'hide': loading}"></spinner>
        <div v-show="!loading">
            <i-button type="text" size="small" @click="add" style="margin: 15px 30px 15px 30px"><Icon type="plus" :size="24"></Icon></i-button>
            <Input v-model="searchStr" style="width: 350px; margin: 15px 30px 15px 30px; float:right" placeholder="<- Filtered by">
                <Select v-model="searchSelected" slot="prepend" style="width: 110px">
                    <Option v-for="item in searchList" :value="item.value" :key="item">{{item.label}}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="updateList"></Button>
            </Input>
            <Table
                :columns="columns"
                :data="students"
                :width="width - 60"
                style="margin: 0 30px 30px 30px"
                size="small"
                @on-sort-change="sort"></Table>
            <div class="container">
                <Page :total="total" :page-size="pageSize" :current="page + 1" @on-change="changePage"></Page>
            </div>
        </div>
        <Modal v-model="showModal" :mask-closable="false" @on-cancel="cancel">
            <p slot="header" class="text-center">{{mode}} Student</p>
            <student-add v-if="mode === 'Add'"></student-add>
            <student-edit v-if="mode === 'Edit'" v-model="editing"></student-edit>
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
    import ResizeWatcher from '@/components/ResizeWatcher.vue'
    import {EventBus} from '../../../main'
    import StudentEdit from './StudentEdit.vue'
    import StudentAdd from './StudentAdd.vue'
    import copy from '@/copy'
    export default {
        components: {
            Spinner,
            ResizeWatcher,
            StudentEdit,
            StudentAdd
        },
        name: 'Student',
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
                        key: 'lastName',
                        sortable: 'custom'
                    },
                    {
                        title: 'First Name',
                        key: 'firstName',
                        sortable: 'custom'
                    },
                    {
                        title: 'Preferred Name',
                        key: 'preferredName',
                        sortable: 'custom'
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
                                    <i-button type="text" size="small" @click="notImplemented">
                                        <Icon type="trash-a" :size="16"></Icon></i-button>`
                        }
                    }
                ],
                sortStr: 'lastName,asc',
                searchStr: '',
                searchList: [
                    {
                        label: 'ID',
                        value: 'idNumber'
                    },
                    {
                        label: 'Last Name',
                        value: 'lastName'
                    },
                    {
                        label: 'First Name',
                        value: 'firstName'
                    },
                    {
                        label: 'Preferred Name',
                        value: 'preferredName'
                    },
                    {
                        label: 'Email',
                        value: 'email'
                    }
                ],
                searchSelected: 'lastName'
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
            total () {
                return this.searching ? this.$store.state.student.students.length : this.$store.state.student.totalPages
            },
            students () {
                let stus = this.$store.state.student.students.map((event) => {
                    let newEvent = copy(event)
                    newEvent.email = newEvent.email ? 'Yes' : 'No'
                    newEvent.cardSecret = newEvent.cardSecret ? 'Yes' : 'No'
                    return newEvent
                })
                const startI = this.page * this.pageSize
                return this.searching ? stus.slice(startI, startI + Math.min(10, stus.length - startI)) : stus
            },
            searching () {
                return this.$store.state.student.searching
            },
            pageSize () {
                return this.searching ? this.$store.state.student.size : 1
            }
        },
        methods: {
            updateList (first = false) {
                const self = this
                this.loading = true
                if (this.searchStr === '') {
                    this.$store.dispatch('fetchStudents', {
                        page: self.page,
                        sort: this.sortStr,
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
                } else {
                    this.$store.dispatch('searchStudents', {
                        page: this.page,
                        search: this.searchStr,
                        filter: this.searchSelected,
                        sort: this.sortStr,
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
                }
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
                let newI = this.searching ? this.page * this.pageSize + index : index
                this.editing = copy(this.$store.state.student.students[newI])
                this.mode = 'Edit'
            },
            notImplemented () {
                this.$Message.warning('This feature is not implemented!')
            },
            fakeDelete (index) {
                this.editing = this.students[index].idNumber
                this.mode = 'Delete'
            },
            remove (id) {
                const self = this
                this.$store.dispatch('removeStudent', {
                    id: id,
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
            },
            sort ({column, key, order}) {
                if (order === 'normal') {
                    this.sortStr = 'lastName,asc'
                } else {
                    this.sortStr = key + ',' + order
                }
                if (this.searching) {
                    this.$store.commit('STUDENTS_SORT', this.sortStr)
//                    console.log('function end')
                } else {
                    this.updateList()
                }
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
