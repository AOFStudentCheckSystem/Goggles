<template>
    <div>
        <spinner v-if="loading"></spinner>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="64" v-else>
            <Form-item label="Name" prop="name">
                <Input v-model="formValidate.name"></Input>
            </Form-item>
            <p style="margin-left: 5em">
                <Icon type="information-circled"></Icon>
                Changes on events will take effect immediately.
            </p>
            <Form-item label="Events" prop="groupItems">
                <Transfer
                    :data="events"
                    :target-keys="groupItems"
                    filterable
                    :filter-method="filterMethod"
                    :titles="['Available', 'Selected']"
                    :render-format="render"
                    @on-change="onChange"></Transfer>
            </Form-item>
            <Form-item>
                <Button type="primary" @click="handleSubmit('formValidate')" :disabled="loading">
                    {{loading ? 'Please wait' : 'Submit'}}
                </Button>
            </Form-item>
        </Form>
    </div>
</template>

<style scoped>

</style>

<script>
    import {EventBus} from '../../../main'
    import copy from '@/copy'
    import Spinner from '@/components/Spinner'
    export default {
        name: 'EventGroupEdit',
        components: {
            Spinner
        },
        data () {
            return {
                formValidate: {
                    name: ''
                },
                groupItems: [],
                ruleValidate: {
                    name: [
                        {required: true, message: 'Please name the event group', trigger: 'blur'}
                    ]
                },
                events: [],
                loading: true,
                eventEdited: false
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const self = this
                        this.$store.dispatch('editEventGroup', {
                            form: this.formValidate,
                            callback (ret) {
                                if (ret.success) {
                                    self.$Message.success('Event group edited!')
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
            onChange (targetKeys, direction, moveKeys) {
                if (moveKeys.length !== 1) {
                    this.$Message.warning('Please select only one event!')
                } else {
                    const self = this
                    this.$store.dispatch(direction === 'left' ? 'removeEventFromEventGroup' : 'addEventToEventGroup', {
                        eventId: moveKeys[0],
                        eventGroupId: this.value.id,
                        callback ({success}) {
                            if (success) {
                                self.eventEdited = true
                                self.groupItems = targetKeys
                            } else {
                                self.$Message.error('An error has occurred')
                            }
                        }
                    })
                }
            }
        },
        mounted () {
            const self = this
            this.formValidate = copy(this.value)
            this.$store.dispatch('fetchAllEvents', {
                status: 'future',
                callback (ret) {
                    if (ret.success) {
                        ret.data.forEach(item => {
                            item.key = item.eventId
                        })
                        self.events = ret.data
                        self.value.events.forEach((evt) => {
                            if (self.events.filter((e) => {
                                return evt.eventId === e.eventId
                            }).length === 0) {
                                evt.key = evt.eventId
                                self.events.push(evt)
                            }
                            self.groupItems.push(evt.eventId)
                        })
                        self.loading = false
                    } else {
                        this.$Message.error('An error has occurred')
                    }
                }
            })
        },
        props: {
            value: {
                type: Object,
                required: true
            }
        },
        beforeDestroy () {
            if (this.eventEdited) {
                EventBus.$emit('form-submit', 1)
            }
        }
    }
</script>
