<template>
    <Menu mode="horizontal" theme="primary">
        <Submenu name="user" class="submenu">
            <template slot="title">
                用户
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
        }
    }
</script>
