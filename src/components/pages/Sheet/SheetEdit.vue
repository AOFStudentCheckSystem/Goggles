<template>
    <div>
        <spinner v-if="loading"></spinner>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="64" v-else>
            <Form-item label="Name" prop="name">
                <Input v-model="formValidate.name"></Input>
            </Form-item>
            <Form-item label="Event Groups" prop="groups">
                <h3>Available Groups</h3>
                <Select v-model="selectedGroupsToAdd" filterable multiple style="width:260px" placeholder="supports select multiple and search">
                    <Option v-for="item in availableGroups" :value="item.id" :key="item">{{ item.name }}</Option>
                </Select>
                <i-button type="text" size="small" @click="addGroups">
                    <Icon type="plus" :size="20"></Icon></i-button>
                <h3>Selected Groups</h3>
                <p>Order here will show up on actual sheet</p>
                <draggable v-model="formValidate.groups" class="draggable">
                    <div v-for="group in formValidate.groups" class="draggable-div">
                        <span class="draggable-span">{{group.name}}
                        <i-button type="text" size="small" @click="removeGroup(group.id)">
                            <Icon type="trash-a" :size="16"></Icon></i-button></span>
                    </div>
                </draggable>
            </Form-item>
            <Form-item label="Status" prop="status">
                <Radio-group v-model="formValidate.status">
                    <Radio label="0">Future</Radio>
                    <Radio label="1">Open</Radio>
                    <Radio label="2">Close</Radio>
                </Radio-group>
            </Form-item>
            <Form-item>
                <Button type="primary" @click="handleSubmit('formValidate')" :disabled="loading">{{loading?'Please wait':'Submit'}}</Button>
            </Form-item>
        </Form>
    </div>
</template>

<style scoped>
    .draggable {
        min-height: 100px;
        background-color: #f0f0f0;
        padding-top: 1px;
        padding-bottom: 1px;
        border-radius: 5px;
    }
    .draggable-div {
        margin: 5px;
        padding: 5px;
        background-color: white;
        border-radius: 5px;
    }
    .draggable-span {
        font-size: 10pt;
    }
</style>

<script>
    import {EventBus} from '../../../main'
    import Spinner from '@/components/Spinner'
    import draggable from 'vuedraggable'
    export default {
        name: 'SheetEdit',
        data () {
            return {
                formValidate: {
                    name: '',
                    groups: [],
                    status: 0
                },
                ruleValidate: {
                    name: [
                        {required: true, message: 'Please name the sheet', trigger: 'blur'}
                    ]
                },
                availableGroups: [],
                selectedGroupsToAdd: [],
                loading: true
            }
        },
        components: {
            Spinner,
            draggable
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const self = this
                        this.$store.dispatch('editSheet', {
                            id: self.value.id,
                            form: this.formValidate,
                            callback (ret) {
                                if (ret.success) {
                                    self.$store.dispatch('setEventGroupsToSheet', {
                                        id: self.value.id,
                                        form: self.formValidate,
                                        callback (ret2) {
                                            if (ret2.success) {
                                                self.$Message.success('Sheet edited!')
                                                EventBus.$emit('form-submit', 2)
                                            } else {
                                                self.$Message.error('An error has occurred!')
                                                console.error(ret2.cause)
                                            }
                                        }
                                    })
                                } else {
                                    self.$Message.error('An error has occurred!')
                                    console.error(ret.cause)
                                }
                            }
                        })
                    } else {
                        this.$Message.error('Form is not valid!')
                    }
                })
            },
            addGroups () {
                if (this.selectedGroupsToAdd.length < 1) {
                    this.$Message.warning('Please select something!')
                } else {
                    this.selectedGroupsToAdd.forEach(id => {
                        for (let i = 0; i < this.availableGroups.length; i++) {
                            if (id === this.availableGroups[i].id) {
                                this.formValidate.groups.push(this.availableGroups.splice(i, 1)[0])
                                break
                            }
                        }
                    })
                    this.selectedGroupsToAdd = []
                }
            },
            removeGroup (gid) {
                for (let i = 0; i < this.formValidate.groups.length; i++) {
                    if (gid === this.formValidate.groups[i].id) {
                        this.availableGroups.splice(0, 0, this.formValidate.groups.splice(i, 1)[0])
                        break
                    }
                }
            }
        },
        mounted () {
            this.formValidate.name = this.value.name
            this.formValidate.groups = this.value.entries.sort((a, b) => {
                return b.weight - a.weight
            }).map(event => {
                return event.eventGroup
            })
            this.formValidate.status = this.value.status
            const self = this
            this.$store.dispatch('fetchAvailableEventGroups', {
                callback (ret) {
                    if (ret.success) {
                        self.availableGroups = ret.data.groups
                        self.loading = false
                    } else {
                        console.error(ret.cause)
                        self.$Message.error('An error has occurred')
                    }
                }})
        },
        props: {
            value: {
                type: Object,
                required: true
            }
        }
    }
</script>
