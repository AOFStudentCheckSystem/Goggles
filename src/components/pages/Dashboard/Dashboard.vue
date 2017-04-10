<template>
    <Row>
        <Col :xs="24" :sm="24" :md="12" :lg="8">
            <dashboard-card>
                <h1 slot="title">Placeholder</h1>
                <p>Placeholder</p>
            </dashboard-card>
        </Col>
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
