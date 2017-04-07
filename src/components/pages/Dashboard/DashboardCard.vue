<template>
    <Card :style="{'width' : width + 'px'}">
        <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            经典电影
        </p>
        <a href="#" slot="extra" @click.prevent="changeLimit">
            <Icon type="ios-loop-strong"></Icon>
            换一换
        </a>
        <slot></slot>
    </Card>
</template>

<style scoped>

</style>

<script>
    export default {
        name: 'DashboardCard',
        props: {
            width: {
                type: Number,
                default: 350
            }
        }
    }
</script>
