/**
* Created by dummy on 4/4/17.
*/

<style scoped>
    .input {
        min-width: 300px;
    }
    .button {
        min-width: 200px;
    }
</style>

<template>
    <Form ref="form" :model="form" :rules="rule" inline>
        <Form-item prop="user">
            <Input type="text" v-model="form.user" placeholder="Email" class="input">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
        </Form-item>
        <Form-item prop="password">
            <Input type="password" v-model="form.password" placeholder="Password" class="input">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </Input>
        </Form-item>
        <Form-item>
            <Checkbox v-model="form.register">Register</Checkbox>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="handleSubmit('form')" class="button">{{ form.register ? 'Register' : 'Sign In' }}</Button>
        </Form-item>
    </Form>
</template>

<script>
    export default {
        data () {
            return {
                form: {
                    user: '',
                    password: '',
                    register: false
                },
                rule: {
                    user: [
                        { required: true, message: 'Please enter the username', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Please enter the password', trigger: 'blur' },
                        { type: 'string', min: 8, message: 'The password has to be at least 8 characters long', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success')
                    } else {
                        this.$Message.error('Failure')
                    }
                })
            }
        }
    }
</script>
