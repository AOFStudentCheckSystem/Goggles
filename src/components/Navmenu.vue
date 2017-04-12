<template>
    <Menu mode="vertical"
          theme="dark"
          activeName="dashboard"
          @on-select="onSelect"
          :accordion="true"
          class="side-menu"
          :class="{'hide-text': hideText}"
          :width="hideText?'80px':'240px'">
        <Menu-item name="Dashboard">
            <Icon type="ios-speedometer" :size="iconSize"></Icon>
            <span class="text"> Dashboard</span>
        </Menu-item>
        <Menu-item name="Event">
            <Icon type="chatbox" :size="iconSize"></Icon>
            <span class="text">Events</span>
        </Menu-item>
        <Menu-item name="EventGroup">
            <Icon type="chatboxes" :size="iconSize"></Icon>
            <span class="text">Event Groups</span>
        </Menu-item>
        <Menu-item name="Sheet">
            <Icon type="ios-calendar" :size="iconSize"></Icon>
            <span class="text">Sign-up Sheets</span>
        </Menu-item>
    </Menu>
</template>

<style scoped>
    .side-menu {
        height: calc(100vh - 60px);
    }
    .hide-text .text {
        display: none;
    }
</style>

<script>
    import {EventBus} from '../main'
    export default {
        name: 'Navmenu',
        methods: {
            onSelect (key) {
                this.$router.push({ name: key })
            },
            sendSidenav () {
//                console.log('send sidenav-resize')
                EventBus.$emit('sidenav-resize', this.hideText ? 80 : 240)
            }
        },
        props: {
            hideText: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            iconSize () {
                return !this.hideText ? 24 : 36
            }
        },
        watch: {
            hideText (newVal, oldVal) {
                this.sendSidenav()
            }
        },
        mounted () {
            const self = this
            EventBus.$on('require-sidenav', () => {
//                console.log('receive require-sidenav')
                self.sendSidenav()
            })
        }
    }
</script>
