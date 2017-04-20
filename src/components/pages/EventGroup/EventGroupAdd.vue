<template>
    <div>
        <spinner v-if="loading"></spinner>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="64" v-else>
        <Form-item label="Name" prop="name">
            <Input v-model="formValidate.name"></Input>
        </Form-item>
        <Form-item label="Events" prop="groupItems">
            <Transfer
                :data="events"
                :target-keys="formValidate.groups"
                filterable
                :filter-method="filterMethod"
                :titles="['Available', 'Selected']"
                :render-format="render"
                @on-change="onChange"></Transfer>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="handleSubmit('formValidate')" :disabled="loading">{{loading?'Please wait':'Submit'}}</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </Form-item>
    </Form>
    </div>
</template>

<style scoped>

</style>

<script>
    import {EventBus} from '../../../main'
    import Spinner from '@/components/Spinner'
    export default {
        name: 'EventGroupAdd',
        data () {
            return {
                formValidate: {
                    name: '',
                    groups: []
                },
                ruleValidate: {
                    name: [
                        {required: true, message: 'Please name the event group', trigger: 'blur'}
                    ]
                },
                events: [],
                loading: true
            }
        },
        components: {
            Spinner
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const self = this
                        this.$store.dispatch('newEventGroup', {
                            form: this.formValidate,
                            callback (ret) {
                                if (ret.success) {
                                    self.$Message.success('Event group added!')
                                } else {
                                    self.$Message.error('An error has occurred!')
                                    console.error(ret.cause)
                                }
                                EventBus.$emit('form-submit', 1)
                            }
                        })
                    } else {
                        this.$Message.error('Form is not valid!')
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields()
            },
            filterMethod (data, query) {
                return data.eventName.indexOf(query) > -1
            },
            render (item) {
                return item.eventName
            },
            onChange (newTargetKeys) {
                this.formValidate.groups = newTargetKeys
            }
        },
        mounted () {
            const self = this
            this.$store.dispatch('fetchAllEvents', {
                status: 'future',
                callback (ret) {
                    if (ret.success) {
                        ret.data.forEach(item => {
                            item.key = item.eventId
                        })
                        self.events = ret.data
                        self.loading = false
                    } else {
                        self.$Message.error('An error has occurred')
                    }
                }})
        }
    }
</script>
