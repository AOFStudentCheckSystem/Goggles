<template>
    <Spin :fix="fix">
        <Icon type="load-c" size=36 class="spin-icon-load"></Icon>
        <div>Loading</div>
    </Spin>
</template>

<style scoped>
    .spin-icon-load{
        animation: ani-spin 1s linear infinite;
    }
    @keyframes ani-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>

<script>
    export default {
        name: 'Spinner',
        props: {
            fix: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
