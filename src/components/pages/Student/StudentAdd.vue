<template>
    <spinner v-if="loading" :class="{'no-height': loading}" :pad="false"></spinner>
    <Form v-else ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="105">
        <Form-item label="Student ID" prop="idNumber">
            <Input-number v-model="formValidate.idNumber" style="width: 100%"></Input-number>
        </Form-item>
        <Form-item label="Last Name" prop="lastName">
            <Input v-model="formValidate.lastName"></Input>
        </Form-item>
        <Form-item label="First Name" prop="firstName">
            <Input v-model="formValidate.firstName"></Input>
        </Form-item>
        <Form-item label="Preferrend Name" prop="preferredName">
            <Input v-model="formValidate.preferredName"></Input>
        </Form-item>
        <Form-item label="Email" prop="email">
            <Input v-model="formValidate.email"></Input>
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
    import Spinner from '@/components/Spinner'
    export default {
        name: 'StudentAdd',
        data () {
            return {
                formValidate: {
                    idNumber: null,
                    lastName: '',
                    firstName: '',
                    preferredName: '',
                    email: null,
                    cardSecret: null
                },
                ruleValidate: {
                    idNumber: [
                        {required: true, message: 'Please enter valid ID', trigger: 'blur', type: 'number'}
                    ],
                    lastName: [
                        {required: true, message: 'Please enter last name', trigger: 'blur'}
                    ],
                    firstName: [
                        {required: true, message: 'Please enter first name', trigger: 'blur'}
                    ],
                    email: [
                        {required: false, message: 'Please enter correct address', type: 'email', trigger: 'blur'}
                    ]
                },
                loading: false
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const self = this
                        this.loading = true
                        this.$store.dispatch('addStudent', {
                            form: this.formValidate,
                            callback (ret) {
                                if (ret.success) {
                                    self.$Message.success('Student added!')
                                } else {
                                    self.$Message.error('An error has occurred!')
                                    console.error(ret.cause)
                                }
                                self.loading = false
                                EventBus.$emit('form-submit', 3)
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
        components: {
            Spinner
        }
    }
</script>
