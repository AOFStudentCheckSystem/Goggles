<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="105">
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
        <Form-item label="Card Record" prop="cardSecret">
            <Button type="primary" @click="clearRFID" :disabled="!formValidate.cardSecret">Remove Card Record</Button>
        </Form-item>
        <Form-item label="Type" prop="studentType">
            <Radio-group v-model="formValidate.studentType">
                <Radio :label="0">Unspecified</Radio>
                <Radio :label="1">Boarding</Radio>
                <Radio :label="2">Day</Radio>
            </Radio-group>
        </Form-item>
        <Form-item label="Dorm" prop="dorm">
            <Input v-model="formValidate.dorm"></Input>
        </Form-item>
        <Form-item label="Grade" prop="grade">
            <Input-number v-model="formValidate.grade" style="width: 100%"></Input-number>
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
        name: 'StudentEdit',
        data () {
            return {
                formValidate: {},
                ruleValidate: {
                    lastName: [
                        {required: true, message: 'Please enter last name', trigger: 'blur'}
                    ],
                    firstName: [
                        {required: true, message: 'Please enter first name', trigger: 'blur'}
                    ],
                    email: [
                        {required: false, message: 'Please enter correct address', type: 'email', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const self = this
                        this.$store.dispatch('editStudent', {
                            form: this.formValidate,
                            callback (ret) {
                                if (ret.success) {
                                    self.$Message.success('Student edited!')
                                } else {
                                    self.$Message.error('An error has occurred!')
                                    console.error(ret.cause)
                                }
                                EventBus.$emit('form-submit', 3)
                            }
                        })
                    } else {
                        this.$Message.error('Form is not valid!')
                    }
                })
            },
            clearRFID () {
                this.formValidate.cardSecret = ''
            }
        },
        mounted () {
            this.formValidate = this.value
            this.formValidate.idNumber = Number(this.formValidate.idNumber)
        },
        props: {
            value: {
                type: Object,
                required: true
            }
        }
    }
</script>
