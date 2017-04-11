<template>
    <div>
        <spinner class="spin" v-if="loading"></spinner>
    </div>
</template>

<style scoped>
    .spin {
        margin-top: 25%;
    }
</style>
<script>
    import Spinner from '../../Spinner'
    export default {
        components: {Spinner},
        name: 'Event',
        data () {
            return {
                loading: true
            }
        }
    }
</script>
