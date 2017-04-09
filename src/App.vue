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
                <Button>Register</Button>
                <Button type="primary">Login</Button>
            </div>
        </Modal>
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
</style>
<script>
    import Navbar from '@/components/Navbar.vue'
    import Navmenu from '@/components/Navmenu.vue'
    import LoginPanel from '@/components/LoginPanel.vue'
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
                showModal: false
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
                console.log(form)
            }
        },
        mounted () {
            window.addEventListener('resize', this.changeWidth)
            this.showModal = !this.$store.state.user.authenticated
        },
        beforeDestroy () {
            window.removeEventListener('resize', this.changeWidth)
        }
    }
</script>
