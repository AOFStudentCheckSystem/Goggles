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
            <Icon type="ios-speedometer-outline" :size="iconSize"></Icon>
            <span class="text"> Dashboard</span>
        </Menu-item>
        <Menu-item name="Event">
            <Icon type="ios-flag-outline" :size="iconSize"></Icon>
            <span class="text"> &nbsp;&nbsp;Event Management</span>
        </Menu-item>
        <Menu-item name="Week">
            <Icon type="ios-calendar-outline" :size="iconSize"></Icon>
            <span class="text"> &nbsp;Week Management</span>
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
    export default {
        name: 'Navmenu',
        methods: {
            onSelect (key) {
                console.log(key)
                switch (key) {
                    case 'Dashboard': this.$router.push({name: 'Dashboard'})
                        break
                }
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
