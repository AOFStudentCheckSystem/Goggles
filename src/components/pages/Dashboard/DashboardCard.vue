<template>
    <Col :xs="24" :sm="24" :md="12" :lg="8">
        <Card :style="{'width' : width + 'px'}" class="card">
            <p slot="title">
                <slot name="title"></slot>
            </p>
            <slot></slot>
        </Card>
    </Col>
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
