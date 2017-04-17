<template>
    <Form ref="formValidate" :model="value" :rules="ruleValidate" :label-width="64">
        <Form-item label="Name" prop="eventName">
            <Input v-model="value.eventName"></Input>
        </Form-item>
        <Form-item label="Time" prop="eventTime" disabled>
            <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" v-model="value.eventTime"></Date-picker>
        </Form-item>
        <Form-item label="Description" prop="eventDescription">
            <Input v-model="value.eventDescription" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </Form-item>
        <Form-item label="Status" prop="eventStatus">
            <Radio-group v-model="value.eventStatus">
                <Radio label="0">Scheduled</Radio>
                <Radio label="1">Boarding</Radio>
                <Radio label="2">Complete</Radio>
            </Radio-group>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
        </Form-item>
    </Form>
</template>

<style scoped>

</style>

<script>
    import {EventBus} from '../../../main'
    export default {
        name: 'EventEdit',
        data () {
            return {
                ruleValidate: {
                    eventName: [
                        {required: true, message: 'Please name the event', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const self = this
                        this.$store.dispatch('editEvent', {
                            form: this.value,
                            callback (ret) {
                                if (ret.success) {
                                    self.$Message.success('Event edited!')
                                } else {
                                    self.$Message.error('An error has occurred!')
                                    console.error(ret.cause)
                                }
                                EventBus.$emit('form-submit', 0)
                            }
                        })
                    } else {
                        this.$Message.error('Form is not valid!')
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields()
            }
        },
        props: {
            value: {
                type: Object,
                required: true
            }
        },
        watch: {
            value: {
                handler (newVal) {
                    this.$emit('input', newVal)
                },
                deep: true
            }
        }
    }
</script>
