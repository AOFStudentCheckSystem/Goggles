<template>
    <div>
        <navbar class="navbar"></navbar>
        <div class="container">
            <navmenu :hideText="hideText"></navmenu>
            <div class="main-content">
                <div class="header">
                    <i-button type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </i-button>
                </div>
                <router-view></router-view>
            </div>
        </div>
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
            isLoggedIn () {
                return this.$store.state.authentication.authenticated
            }
        },
        data () {
            return {
                spanLeft: 5,
                spanRight: 19,
                hideText: false
            }
        },
        methods: {
            toggleClick () {
//                if (this.spanLeft === 5) {
//                    this.spanLeft = 2
//                    this.spanRight = 22
//                } else {
//                    this.spanLeft = 5
//                    this.spanRight = 19
//                }
                this.hideText = !this.hideText
            }
        }
    }
</script>
