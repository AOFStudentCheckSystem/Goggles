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
        <Submenu name="Event">
            <template slot="title">
                <Icon type="flag" :size="iconSize"></Icon>
                <span class="text">Event Management</span>
            </template>
            <Menu-item name="EventModify">
                <Icon type="edit" :size="18"></Icon>
                <span class="text">Modify Events</span>
            </Menu-item>
            <Menu-item name="EventForm">
                <Icon type="ios-paper" :size="18"></Icon>
                <span class="text">Sign-up Forms</span>
            </Menu-item>
        </Submenu>
        <Submenu name="Stats">
            <template slot="title">
                <Icon type="stats-bars" :size="iconSize"></Icon>
                <span class="text">Statistics</span>
            </template>
            <Menu-item name="StatsEvent">
                <Icon type="checkmark" :size="18"></Icon>
                <span class="text">Events Stats</span>
            </Menu-item>
            <Menu-item name="StatsForm">
                <Icon type="document-text" :size="18"></Icon>
                <span class="text">Sign-up Forms Stats</span>
            </Menu-item>
        </Submenu>
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
    export default {
        name: 'Navmenu',
        methods: {
            onSelect (key) {
                this.$router.push({ name: key })
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
        }
    }
</script>
