<template>
    <Menu mode="horizontal" theme="primary">
        <Submenu name="user" class="submenu" v-if="loggedIn">
            <template slot="title">
                {{username}}
            </template>
            <Menu-item name="logOut">Log out</Menu-item>
            <Menu-item name="changePassword">Change password</Menu-item>
        </Submenu>
    </Menu>
</template>

<style scoped>
    .submenu {
        float: right !important;
        margin-right: 2em;
    }
</style>

<script>
    export default {
        name: 'Navbar',
        methods: {
            navbarSelect () {}
        },
        computed: {
            loggedIn () {
                return this.$store.state.user.authenticated
            },
            username () {
                return this.$store.state.user.email
            }
        }
    }
</script>
