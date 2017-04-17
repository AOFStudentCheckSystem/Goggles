<template>
    <div>
        <resize-watcher @resize="changeWidth" listenWindow></resize-watcher>
        <navbar class="navbar" @signOut="init"></navbar>
        <div class="container">
            <navmenu :hideText="hideText" class="nav-menu-width"></navmenu>
            <div class="main-content">
                <div class="header">
                    <Button type="text" @click="toggleClick" v-if="width > 768">
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
                <login-panel v-model="form"></login-panel>
            </div>
            <div slot="footer">
                <Button type="text" class="float-left">Forgot your password?</Button>
                <Button :disabled="true">Register</Button>
                <Button type="primary" @click="login">Login</Button>
            </div>
        </Modal>
        <spinner fix v-if="loading"></spinner>
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
        display: flex
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
    .nav-menu-width {
        flex-grow: 0;
        flex-shrink: 0;
    }
</style>
<script>
    import Navbar from '@/components/Navbar.vue'
    import Navmenu from '@/components/Navmenu.vue'
    import LoginPanel from '@/components/LoginPanel.vue'
    import {axia, EventBus} from './main'
    import Spinner from '@/components/Spinner.vue'
    import ResizeWatcher from '@/components/ResizeWatcher.vue'
    export default {
        name: 'app',
        components: {
            Navbar,
            Navmenu,
            LoginPanel,
            Spinner,
            ResizeWatcher
        },
        computed: {
            loggedIn () {
                return this.$store.state.user.authenticated
            },
            hideText () {
                return this.width <= 768 || this.hideTextOverride
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
                                self.loading = false
                                EventBus.$emit('login-reset')
                            } else {
                                if (ret.cause) {
                                    self.$Message.error('Service down, please contact administrator')
                                } else {
                                    self.$Message.error('Login failed, please check your input!')
                                }
                            }
                        }
                    })
                }
            },
            init () {
                const auth = localStorage.getItem('Authorization')
                if (auth) {
                    console.log(auth)
                    axia.defaults.headers.common['Authorization'] = auth
                    const self = this
                    this.$store.dispatch('verifyToken', {
                        callback (ret) {
                            self.showModal = !self.$store.state.user.authenticated
                        }
                    })
                } else {
                    this.showModal = true
                }
                this.loading = this.showModal
            }
        },
        created () {
            const self = this
            this.init()
            axia.interceptors.response.use((response) => {
                return response
            }, (error) => {
                if (error.response && error.response.status === 401) {
                    self.$store.dispatch('verifyToken', {
                        callback ({success}) {
                            self.$Message.error(success ? 'You don\'t have the permission to do so.' : 'Session expired, please login again.')
                            return Promise.reject(error)
                        }
                    })
                } else {
                    return Promise.reject(error)
                }
            })
        }
    }
</script>
