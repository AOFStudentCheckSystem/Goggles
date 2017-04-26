<template>
    <div>
        <resize-watcher @resize="changeWidth" listenWindow></resize-watcher>
        <navbar class="navbar no-print" @signOut="init"></navbar>
        <div class="below-top-nav">
            <navmenu :hideText="hideText" class="nav-menu-width no-print"></navmenu>
            <div class="main-content">
                <div class="header no-print">
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
    body {
        overflow-y: hidden;
    }
    .navbar {
        position: fixed;
        top: 0;
    }
    .header{
        height: 4em;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .main-content {
        -webkit-flex: 1;
        flex: 1;
        overflow: auto;
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
    @media print {
        * {
            visibility: hidden !important;
            position: relative !important;
        }
        .print-section, .print-section * {
            visibility: visible !important;
        }
        .print-section {
            margin-top: -60px !important;
        }
        .no-print {
            display: none !important;
        }
    }
    .below-top-nav {
        position: absolute;
        top: 60px;
        right: 0;
        bottom: 0;
        left: 0;
        display: -webkit-flex;
        display: flex;
    }
    .no-height {
        height: 50px;
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
//            axia.interceptors.request.use((request) => {
//                console.log(request)
//                return request
//            }, (error) => {
//                return Promise.reject(error)
//            })
            axia.interceptors.response.use((response) => {
                return response
            }, (error) => {
                if (error.response && error.response.status === 401 && !error.response.config.url.endsWith('auth/verify')) {
                    self.$store.dispatch('verifyToken', {
                        callback ({success}) {
                            self.$Message.error(success ? 'You don\'t have the permission to do so.' : 'Session expired, please login again.')
                            return Promise.reject(error)
                        }
                    })
                } else if (error.response && error.response.status === 403) {
                    setTimeout(() => {
                        self.$Message.error('You don\'t have the permission to do so.')
                    }, 500)
                    return Promise.reject(error)
                } else {
                    return Promise.reject(error)
                }
            })
        }
    }
</script>
