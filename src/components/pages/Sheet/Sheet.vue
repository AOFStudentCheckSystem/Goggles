<template>
    <div>
        <resize-watcher @resize="magic" listenWindow listenDOM></resize-watcher>
        <spinner v-if="loading"></spinner>
        <div v-else>
            <i-button type="text" size="small" @click="add"><Icon type="plus" :size="24" style="margin: 15px 30px 15px 30px"></Icon></i-button>
            <Table
                :columns="columns"
                :data="sheets"
                :width="width - 60"
                style="margin: 0 30px 30px 30px"
                size="small"></Table>
        </div>
        <Modal v-model="showModal" :mask-closable="false" @on-cancel="cancel">
            <p slot="header" class="text-center">{{mode}} Sheet</p>
            <sheet-add v-if="mode === 'Add'"></sheet-add>
            <!--<event-edit v-if="mode === 'Edit'" v-model="editing"></event-edit>-->
            <div slot="footer" class="text-center">Created by Yaotian Feng, Yuanchu Xie, and Peiqi Liu</div>
        </Modal>
    </div>
</template>

<style scoped>
    .text-center {
        text-align:center
    }
</style>
<script>
    import Spinner from '../../Spinner'
    import ResizeWatcher from '@/components/ResizeWatcher.vue'
    import {EventBus} from '../../../main'
//    import EventEdit from './EventEdit.vue'
    import SheetAdd from './SheetAdd.vue'
    import copy from '@/copy'
    export default {
        components: {
            Spinner,
            ResizeWatcher,
//            EventEdit,
            SheetAdd
        },
        name: 'Sheet',
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
                        title: 'Status',
                        key: 'status',
                        width: 100
                    },
                    {
                        title: 'Actions',
                        key: 'action',
                        fixed: 'right',
                        width: 100,
                        render (row, column, index) {
                            return `<i-button type="text" size="small" @click="edit(${index})">
                                        <Icon type="edit" :size="16"></Icon></i-button>`
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
            sheets () {
                return this.$store.state.sheet.sheets.map((event) => {
                    let newSheet = copy(event)
                    switch (newSheet.status) {
                        case 0: newSheet.status = 'Future'
                            break
                        case 1: newSheet.status = 'Open'
                            break
                        case 2: newSheet.status = 'Close'
                            break
                        default: newSheet.status = 'Unknown'
                    }
                    return newSheet
                })
            }
        },
        methods: {
            updateList (first = false) {
                const self = this
                this.loading = true
                this.$store.dispatch('fetchSheets', {
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
            edit (index) {
                this.editing = copy(this.$store.state.sheet.sheets[index])
                this.mode = 'Edit'
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
            EventBus.$on('form-submit', () => {
                self.cancel()
                self.updateList()
            })
            this.updateList(true)
        }
    }
</script>
