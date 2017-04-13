<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="64">
        <Form-item label="Name" prop="name">
            <Input v-model="formValidate.name"></Input>
        </Form-item>
        <Form-item label="Time" prop="time" disabled>
            <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" v-model="formValidate.time"></Date-picker>
        </Form-item>
        <Form-item label="Description" prop="descriptions">
            <Input v-model="formValidate.descriptions" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </Form-item>
    </Form>
</template>

<style scoped>

</style>

<script>
    import {EventBus} from '../../../main'
    export default {
        name: 'EventAdd',
        data () {
            return {
                formValidate: {
                    name: '',
                    time: 0,
                    descriptions: ''
                },
                ruleValidate: {
                    name: [
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
                        this.$store.dispatch('addEvent', {
                            form: this.formValidate,
                            callback (ret) {
                                if (ret.success) {
                                    self.$Message.success('Event added!')
                                } else {
                                    self.$Message.error('An error has occurred!')
                                    console.error(ret.cause)
                                }
                                EventBus.$emit('form-submit')
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
        }
    }
</script>
