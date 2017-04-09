<template>
    <div>
        <navbar class="navbar"></navbar>
        <div class="container">
            <navmenu :hideText="hideText"></navmenu>
            <div class="main-content">
                <div class="header">
                    <i-button type="text" @click="toggleClick" v-if="width >= 768">
                        <Icon type="navicon" size="32"></Icon>
                    </i-button>
                </div>
                <router-view></router-view>
            </div>
        </div>
        <Modal
            v-model="showModal"
            :closable="false">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>此任务删除后，下游 10 个任务将无法执行。</p>
                <p>是否继续删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="del">删除</Button>
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
</style>
<script>
    import Navbar from '@/components/Navbar.vue'
    import Navmenu from '@/components/Navmenu.vue'
    export default {
        name: 'app',
        components: {
            Navbar,
            Navmenu
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
