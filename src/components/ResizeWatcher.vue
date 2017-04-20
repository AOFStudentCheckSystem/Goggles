<template>
    <resize-observer @notify="changeWidth" class="magic" v-if="listenDOM"></resize-observer>
</template>

<style scoped>
    .magic {
        position: relative
    }
</style>

<script>
    import { ResizeObserver } from 'vue-resize/dist/vue-resize'
    export default {
        name: 'ResizeWatcher',
        components: {
            ResizeObserver
        },
        methods: {
            changeWidth () {
                this.$emit('resize')
            }
        },
        props: {
            listenDOM: {
                type: Boolean,
                default: false
            },
            listenWindow: {
                type: Boolean,
                default: false
            }
        },
        mounted () {
            if (this.listenWindow) {
                window.addEventListener('resize', this.changeWidth)
            }
        },
        beforeDestroy () {
            if (this.listenWindow) {
                window.removeEventListener('resize', this.changeWidth)
            }
        }
    }
</script>
