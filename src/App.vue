<template>
    <div>
        <navbar class="navbar"></navbar>
        <div class="container">
            <navmenu :hideText="hideText"></navmenu>
            <div class="main-content">
                <div class="header">
                    <Button type="text" @click="toggleClick" v-if="width >= 768">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <router-view></router-view>
            </div>
        </div>
        <Modal
            v-model="showModal"
            :closable="false"
            :mask-closable="false">
            <p slot="header" class="align-center">
                <Icon type="log-in"></Icon>
                <span>Please Login</span>
            </p>
            <div class="align-center">
                <login-panel @input="onFormInput"></login-panel>
            </div>
            <div slot="footer">
                <Button type="text" class="float-left">Forgot your password?</Button>
                <Button :disabled="true">Register</Button>
                <Button type="primary" @click="login">Login</Button>
            </div>
        </Modal>
        <Spin fix v-if="loading">
            <Icon type="load-c" size=36 class="spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<style>
    .navbar {
        position: fixed;
        top: 0;
    }
    .header{
        height: 4em;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .container {
        display: -webkit-flex;
        display: flex;
    }
    .main-content {
        -webkit-flex: 1;
        flex: 1;
    }
    .align-center {
        text-align:center
    }
    .float-left {
        float: left;
    }

    .spin-icon-load{
        animation: ani-spin 1s linear infinite;
    }
    @keyframes ani-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>
<script>
    import Navbar from '@/components/Navbar.vue'
    import Navmenu from '@/components/Navmenu.vue'
    import LoginPanel from '@/components/LoginPanel.vue'
    import {axia} from './main'
    export default {
        name: 'app',
        components: {
            Navbar,
            Navmenu,
            LoginPanel
        },
        computed: {
            loggedIn () {
                return this.$store.state.user.authenticated
            },
            hideText () {
                return this.width < 768 || this.hideTextOverride
            }
        },
        data () {
            return {
                hideTextOverride: false,
                width: document.documentElement.clientWidth,
                showModal: false,
                form: {
                    user: '',
                    password: ''
                },
                loading: true
            }
        },
        methods: {
            toggleClick () {
                this.hideTextOverride = !this.hideTextOverride
            },
            changeWidth () {
                this.width = document.documentElement.clientWidth
            },
            onFormInput (form) {
                this.form = form
            },
            login () {
                let f = this.form
                if (f.user.length < 1 || f.password.length < 8) {
                    this.$Message.warning('Please make sure your input is valid!')
                } else {
                    const self = this
                    this.$store.dispatch('authenticate', {
                        username: f.user,
                        password: f.password,
                        callback (ret) {
                            if (ret.success) {
                                self.showModal = false
                            } else {
                                self.$Message.error('Login failed, please check your input!')
                            }
                        }
                    })
                }
            }
        },
        mounted () {
            window.addEventListener('resize', this.changeWidth)
            let auth = localStorage.getItem('Authorization')
            if (auth) {
                axia.defaults.headers.common['Authorization'] = auth
                console.log(axia.defaults.headers.common['Authorization'])
                const self = this
                this.$store.dispatch('verifyToken', {
                    callback (ret) {
                        self.loading = false
                        self.showModal = !self.$store.state.user.authenticated
                    }
                })
            } else {
                this.loading = false
                this.showModal = true
            }
        },
        beforeDestroy () {
            window.removeEventListener('resize', this.changeWidth)
        }
    }
</script>
