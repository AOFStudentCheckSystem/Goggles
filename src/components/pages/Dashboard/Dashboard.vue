<template>
    <Row>
        <dashboard-card>
            <h1 slot="title">Placeholder</h1>
            <p>Placeholder</p>
        </dashboard-card>
    </Row>
</template>
<style scoped>

</style>

<script>
    import DashboardCard from './DashboardCard.vue'
    export default {
        name: 'Dashboard',
        components: {
            DashboardCard
        }
    }
</script>
