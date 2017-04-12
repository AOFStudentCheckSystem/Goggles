<template>
    <div>
        <spinner v-if="loading"></spinner>
        <Row v-else>
            <Col :xs="24" :sm="24" :md="12" :lg="8">
            <dashboard-card>
                <h1 slot="title">Placeholder</h1>
                <p>Placeholder</p>
            </dashboard-card>
            </Col>
        </Row>
    </div>
</template>
<style scoped>

</style>

<script>
    import DashboardCard from './DashboardCard.vue'
    import Spinner from '../../Spinner.vue'
    export default {
        name: 'Dashboard',
        components: {
            DashboardCard,
            Spinner
        },
        data () {
            return {
                loading: true
            }
        },
        mounted () {
            this.loading = false
        }
    }
</script>
