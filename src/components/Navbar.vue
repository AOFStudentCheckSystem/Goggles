<template>
    <Menu mode="horizontal" theme="primary" @on-select="navbarSelect">
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
            navbarSelect (key) {
                switch (key) {
                    case 'user':
                        break
                    case 'logOut':
                        this.logOut()
                        break
                    default:
                        this.$Message.info('Feature not implemented')
                }
            },
            logOut () {
                const self = this
                this.$store.dispatch('signOut', {
                    callback (ret) {
                        self.$emit('signOut')
                    }
                })
            }
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
