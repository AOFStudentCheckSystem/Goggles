<template>
    <Card class="card">
        <p slot="title">
            <slot name="title"></slot>
        </p>
        <slot></slot>
    </Card>
</template>

<style scoped>
    .card {
        margin: 20px 20px 0 20px;
    }
</style>

<script>
    export default {
        name: 'DashboardCard'
    }
</script>
