<template>
    <div>
        <resize-watcher @resize="magic" listenWindow listenDOM></resize-watcher>
        <spinner v-if="loading" :class="{'hide': loading}"></spinner>
        <div v-show="!loading">
            <i-button type="text" size="small" @click="add" style="margin: 15px 30px 15px 30px"><Icon type="plus" :size="24"></Icon></i-button>
            <Table
                :columns="columns"
                :data="eventGroups"
                :width="width - 60"
                style="margin: 0 30px 30px 30px"
                size="small"></Table>
            <div class="container">
                <Page :total="totalPages" :page-size="1" :current="page + 1" @on-change="changePage"></Page>
            </div>
        </div>
        <Modal v-model="showModal" :mask-closable="false" @on-cancel="cancel">
            <p slot="header" class="text-center">{{mode}} Event Group</p>
            <event-group-add v-if="mode === 'Add'"></event-group-add>
            <event-group-edit v-if="mode === 'Edit'" :value="editing"></event-group-edit>
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
</style>
<script>
    import Spinner from '../../Spinner'
    import ResizeWatcher from '@/components/ResizeWatcher.vue'
    import {EventBus} from '../../../main'
    import EventGroupEdit from './EventGroupEdit.vue'
    import EventGroupAdd from './EventGroupAdd.vue'
    export default {
        components: {
            Spinner,
            ResizeWatcher,
            EventGroupEdit,
            EventGroupAdd
        },
        name: 'EventGroup',
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
                        key: 'id',
                        width: 50
                    },
                    {
                        title: 'Name',
                        key: 'name'
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
                return this.$store.state.eventGroup.page
            },
            totalPages () {
                return this.$store.state.eventGroup.totalPages
            },
            eventGroups () {
                return this.$store.state.eventGroup.eventGroups
            }
        },
        methods: {
            updateList (first = false) {
                const self = this
                this.loading = true
                this.$store.dispatch('fetchEventGroups', {
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
                this.$store.commit('EVENT_GROUPS_PAGE', newPage - 1)
                this.updateList()
            },
            edit (index) {
                this.editing = this.eventGroups[index]
                this.mode = 'Edit'
            },
            remove (index) {
                const self = this
                this.$store.dispatch('removeEventGroup', {
                    id: this.eventGroups[index].id,
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
            }
        },
        mounted () {
            const self = this
            EventBus.$on('sidenav-resize', (size) => {
                self.sidenav = size
                self.magic()
            })
            EventBus.$on('form-submit', (channel) => {
                if (channel === 1) {
                    self.cancel()
                    self.updateList()
                }
            })
            this.updateList(true)
        }
    }
</script>
